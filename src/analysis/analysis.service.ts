/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types, UpdateQuery } from 'mongoose';
import { Analysis } from './analysis.schema';
import axios from 'axios';
import * as AWS from 'aws-sdk';
import { Auth } from 'src/auth/auth.schema';
import { envConfig } from '../config/env.config';
var FormData = require('form-data');
const Pusher = require('pusher');

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel('Analysis') private readonly analysisModel: Model<Analysis>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
  ) {}

  /*************************** send image for analysis ***************************/
  async sendAnalysis(
    files: any[],
    req: { uploaded_by: any; filterName: any; filter: string },
  ): Promise<any> {
    try {
      /***************  USER + CREDIT CHECK ***************/
      const user = await this.authModel.findById(req.uploaded_by);
      if (!user) throw new NotFoundException('User not found');

      if (user.credits < files.length) {
        throw new BadRequestException('Not enough credits');
      }

      const updateCredits = await this.authModel.findByIdAndUpdate(
        req.uploaded_by,
        { credits: user.credits - files.length },
        { new: true },
      );

      /***************  CREATE ANALYSIS DOC ***************/
      const images: any = {};
      files.forEach((_, i) => {
        images[`image${i}`] = {
          original: '',
          result: '',
          status: 'processing',
        };
      });

      const analysis = await new this.analysisModel({
        images,
        uploaded_by: req.uploaded_by,
        filterName: req.filterName,
      }).save();

      /***************  PUSHER INIT ***************/
      const pusher = new Pusher({
        appId: envConfig.pusher.appId,
        key: envConfig.pusher.key,
        secret: envConfig.pusher.secret,
        cluster: envConfig.pusher.cluster,
        useTLS: envConfig.pusher.useTLS,
      });

      /***************  S3 / DO SPACES INIT ***************/
      const s3 = new AWS.S3({
        accessKeyId: envConfig.aws.aws_access_key_id,
        secretAccessKey: envConfig.aws.aws_secret_access_key,
        endpoint: envConfig.aws.AWS_ENDPOINT,
        region: envConfig.aws.aws_region,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      });

      /***************  UPLOAD ORIGINAL IMAGES FIRST ***************/
      for (let i = 0; i < files.length; i++) {
        const uploadResult = await s3
          .upload({
            Bucket: `${envConfig.aws.aws_bucket_name}/User_${analysis.uploaded_by}/Doc_${analysis._id}`,
            Key: `original_${i}_${Date.now()}`,
            Body: files[i].buffer,
            ACL: 'public-read',
            ContentType: files[i].mimetype,
          })
          .promise();

        const originalPath = `images.image${i}.original`;

        await this.analysisModel.findByIdAndUpdate(analysis._id, {
          $set: {
            [originalPath]: uploadResult.Location,
          },
        });

        // realtime update
        pusher.trigger('my-channel', 'my-event', {
          type: 'ORIGINAL_UPLOADED',
          index: i,
          original: uploadResult.Location,
        });
      }

      /***************  PREPARE FORM DATA FOR AI ***************/
      const formData = new FormData();
      formData.append('_id', analysis._id.toString());
      formData.append('id', analysis.uploaded_by.toString());
      formData.append('count', files.length.toString());

      if (analysis.filterName === 'makeup' && req.filter) {
        const response = await axios.get(req.filter, {
          responseType: 'arraybuffer',
        });
        formData.append('makeup', Buffer.from(response.data), 'makeup.png');
      }

      files.forEach((file: { buffer: any; originalname: any }, i: any) => {
        formData.append(`image${i}`, file.buffer, file.originalname);
      });

      /***************  FIRE AI API (NO AWAIT) ***************/
      const API_MAP = {
        smooth: `${envConfig.url.skin_bg_base_api}/skin_smooth`,
        makeup: `${envConfig.url.makeup_base_api}/apply_makeup`,
        remove_bg: `${envConfig.url.skin_bg_base_api}/remove_bg`,
      };

      const apiUrl = API_MAP[analysis.filterName] || API_MAP.remove_bg;

      axios
        .post(apiUrl, formData, {
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        })
        .then(() => {
          console.log('AI processing started');
        })
        .catch((err) => {
          console.error('AI API failed:', err.message);
        });

      /*************** FINAL RESPONSE ***************/
      return {
        analysis: analysis,
        updateCredits,
        message: 'Original images uploaded & AI processing started',
      };
    } catch (error) {
      throw new InternalServerErrorException('Send analysis failed');
    }
  }

  /*************************** get all analysis of a user ***************************/
  async getAllAnalysisOfUser(userId: string): Promise<any> {
    let analysis: string | any[];
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      analysis = await this.analysisModel
        .find({ uploaded_by: userId })
        .populate('uploaded_by');
    } else {
      throw new BadRequestException('Invalid user id');
    }
    if (analysis.length === 0) {
      throw new NotFoundException('No analysiss found');
    }

    return analysis;
  }

  /*************************** get single analysis  ***************************/
  async getSingleAnalysis(analysisId: string): Promise<any> {
    let analysis:
      | Document<unknown, any, Analysis> & Analysis & { _id: Types.ObjectId };
    if (analysisId.match(/^[0-9a-fA-F]{24}$/)) {
      analysis = await this.analysisModel
        .findOne({ _id: analysisId })
        .populate('uploaded_by');
    } else {
      throw new BadRequestException('Invalid analysis id');
    }
    if (!analysis) {
      throw new NotFoundException('No analysis found');
    }

    return analysis;
  }

  /*************************** delete single image  ***************************/
  async deleteImage(analysisId: String, image: string | String): Promise<any> {
    console.log(image, analysisId);

    if (!analysisId || !image) {
      throw new BadRequestException('analysisId and image are required');
    }

    let analysis:
      | (Document<unknown, any, Analysis> & Analysis & { _id: Types.ObjectId })
      | UpdateQuery<Analysis>;
    let newAnalysis: Document<unknown, any, Analysis> &
      Analysis & { _id: Types.ObjectId };
    let name = image.split('/').pop();

    analysis = await this.analysisModel.findOne({ _id: analysisId });

    if (analysis) {
      delete analysis?.images?.[name];
      newAnalysis = await this.analysisModel.findByIdAndUpdate(
        analysisId,
        analysis,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
    }
    if (Object.keys(analysis?.images).length === 0) {
      await this.analysisModel.findByIdAndDelete(analysisId);
      newAnalysis = null;

      return null;
    }
    return newAnalysis;
  }

  /*************************** delete single image from all images ***************************/
  async deleteFromAllAnalysis(image: {
    documentId: string;
    imageKey: string;
  }): Promise<any> {
    const analysis = await this.analysisModel.findById(image.documentId);

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    if (!analysis.images?.[image.imageKey]) {
      throw new BadRequestException('Image key not found in analysis');
    }

    await this.analysisModel.findByIdAndUpdate(
      image.documentId,
      {
        $unset: { [`images.${image.imageKey}`]: '' },
      },
      { new: true },
    );

    const updated = await this.analysisModel.findById(image.documentId);

    if (!updated || Object.keys(updated.images || {}).length === 0) {
      await this.analysisModel.findByIdAndDelete(image.documentId);
    }

    return { success: true };
  }

  async deleteMultipleAnalysis(
    images: { documentId: string; imageKey: string }[],
  ): Promise<any> {
    const deletedImages = [];

    await Promise.all(
      images.map(async ({ documentId, imageKey }) => {
        const analysis = await this.analysisModel.findById(documentId);
        if (!analysis) return;

        if (!analysis.images?.[imageKey]) return;

        await this.analysisModel.updateOne(
          { _id: documentId },
          { $unset: { [`images.${imageKey}`]: '' } },
        );

        deletedImages.push({ documentId, imageKey });

        const updated = await this.analysisModel.findById(documentId);

        if (!updated || Object.keys(updated.images || {}).length === 0) {
          await this.analysisModel.findByIdAndDelete(documentId);
        }
      }),
    );

    return {
      deletedCount: deletedImages.length,
      deletedImages,
    };
  }
}

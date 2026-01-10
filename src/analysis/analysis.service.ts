/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { envConfig } from 'src/config/env.config';
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
    files: string | any[],
    req: { uploaded_by: any; filterName: any; filter: string },
  ): Promise<any> {
    try {
      let updateCredits: Document<unknown, any, Auth> &
        Auth & { _id: Types.ObjectId };

      let user = await this.authModel.findById(req?.uploaded_by);
      if (!user) throw new NotFoundException('User not found');
      const filesCount = files.length;
      const currentCredits = Number(user?.credits ?? 0);

      if (!Number.isFinite(currentCredits)) {
        throw new NotFoundException('Invalid user credits');
      }

      if (currentCredits < filesCount) {
        throw new BadRequestException('Not enough credits');
      }

      updateCredits = await this.authModel.findByIdAndUpdate(
        req?.uploaded_by,
        { credits: user?.credits - files.length },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      let fileData = {};
      let analysis: Document<unknown, any, Analysis> &
        Analysis & { _id: Types.ObjectId };
      for (let x = 0; x < files.length; x++) {
        let key = 'image' + [x];
        fileData[key] = {
          result: '',
          original: '',
          status: 'processing',
        };
        if (x === files.length - 1) {
          const newAnalysis = new this.analysisModel({
            images: fileData,
            uploaded_by: req?.uploaded_by,
            filterName: req?.filterName,
          });
          analysis = await newAnalysis.save();
        }
      }

      // makeup filter to blob conversion

      let formData = new FormData();
      let fileName = 'image';
      formData.append('_id', analysis?._id.toString());
      formData.append('id', analysis?.uploaded_by.toString());
      formData.append('count', files.length.toString());
      if (analysis?.filterName === 'makeup') {
        if (req?.filter) {
          const response = await axios.get(req?.filter, {
            responseType: 'arraybuffer',
          });
          const buffer = Buffer.from(response.data, 'utf-8');
          formData.append('makeup', buffer, fileName);
        }
      }

      for (let x = 0; x < files.length; x++) {
        formData.append(`image${x}`, files[x]?.buffer, fileName);
        console.log(files[x].buffer);
        console.log(formData, 'formData');
        if (x === files.length - 1) {
          if (analysis?.filterName === 'smooth') {
            axios({
              method: 'post',
              url: `${envConfig.url.skin_bg_base_api}/skin_smooth`,
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                return response;
              })
              .catch(function (error) {
                if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Something went wrong');
              });
          } else if (analysis?.filterName === 'makeup') {
            axios({
              method: 'post',
              url: `${envConfig.url.makeup_base_api}/apply_makeup`,
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                return response;
              })
              .catch(function (error) {
                if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Something went wrong');
              });
          } else {
            axios({
              method: 'post',
              url: 'http://localhost:5001/api/remove_bg',
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                return response;
              })
              .catch(function (error) {
                if (error instanceof HttpException) throw error;
                throw new InternalServerErrorException('Something went wrong');
              });
          }
        }
      }

      // // real time update using pusher
      const pusher = new Pusher({
        appId: envConfig.pusher.appId,
        key: envConfig.pusher.key,
        secret: envConfig?.pusher.secret,
        cluster: envConfig.pusher.cluster,
        useTLS: true,
      });

      const s3bucket = new AWS.S3({
        accessKeyId: envConfig.aws.aws_access_key_id,
        secretAccessKey: envConfig.aws.aws_secret_access_key,
        endpoint: envConfig.aws.AWS_ENDPOINT,
        region: envConfig.aws.aws_region,
        signatureVersion: 'v4',
        s3ForcePathStyle: true,
      });

      for (let x = 0; x < files.length; x++) {
        s3bucket.createBucket(() => {
          const params = {
            Bucket: `${envConfig.aws.aws_bucket_name}/User_${analysis?.uploaded_by}/Doc_${analysis?._id}`,
            Key: files[x].fieldname,
            Body: files[x].buffer,
            ACL: 'public-read',
            ContentType: files[x].type,
          };
          s3bucket.upload(
            params,
            async (err: any, fileData: { Location: any }) => {
              const a = `images.image${x}.original`;
              const b = `images.image${x}.status`;
              const res = await this.analysisModel.findByIdAndUpdate(
                analysis._id,
                { $set: { [a]: fileData?.Location } },
              );

              pusher.trigger('my-channel', 'my-event', {
                message: res,
              });

              if (err) {
                if (err instanceof HttpException) throw err;
                throw new InternalServerErrorException('Something went wrong');
              }
            },
          );
        });
      }

      return {
        analysis: analysis,
        updateCredits: updateCredits,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong');
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

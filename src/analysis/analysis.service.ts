import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { json } from 'express';
import { Model } from 'mongoose';
import { Analysis } from './analysis.schema';
import axios from 'axios';
import * as AWS from 'aws-sdk';
import { Auth } from 'src/auth/auth.schema';

var FormData = require('form-data');
const Pusher = require('pusher');

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel('Analysis') private readonly analysisModel: Model<Analysis>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
  ) {}

  /*************************** send image for analysis ***************************/
  async sendAnalysis(files, req): Promise<any> {
    try {
      console.log(req?.uploaded_by);
      let updateCredits;
      let user = await this.authModel.findById(req?.uploaded_by);
      console.log(user);

      updateCredits = await await this.authModel.findByIdAndUpdate(
        req?.uploaded_by,
        { credits: user?.credits - files.length },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      // create mongo document
      console.log('fileData', req);
      let fileData = {};
      let analysis;
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

      // ai api hit

      let formData = new FormData();
      console.log('-->', analysis);
      let fileName = 'image';
      formData.append('_id', analysis?._id.toString());
      formData.append('id', analysis?.uploaded_by.toString());
      formData.append('count', files.length.toString());
      if (analysis?.filterName === 'makeup') {
        if (req?.filter) {
          console.log('makeup', req?.filter);

          // var request = require('request').defaults({ encoding: null });
          // request.get(req?.filter, function (err, res, body) {
          //   formData.append('makeup', body, fileName);
          //   console.log('makeup ==> ', body);
          // });
          const response = await axios.get(req?.filter, {
            responseType: 'arraybuffer',
          });
          const buffer = Buffer.from(response.data, 'utf-8');
          console.log('==>', buffer);
          formData.append('makeup', buffer, fileName);
        }
      }

      for (let x = 0; x < files.length; x++) {
        formData.append(`image${x}`, files[x]?.buffer, fileName);
        console.log(files[x].buffer);
        if (x === files.length - 1) {
          if (analysis?.filterName === 'smooth') {
            axios({
              method: 'post',
              url: 'https://retouching.design/bg-server/api/skin_smooth',
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
          } else if (analysis?.filterName === 'makeup') {
            axios({
              method: 'post',
              url: 'https://retouching.design/makeup-server/api/apply_makeup',
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            axios({
              method: 'post',
              url: 'https://retouching.design/bg-server/api/remove_bg',
              data: formData,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              headers: formData.getHeaders(),
            })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      }
      console.log('formData', formData);

      // // real time

      const pusher = new Pusher({
        appId: '1492326',
        key: '7cf840f33e1b0639c69f',
        secret: '4ab76795d7709d37675c',
        cluster: 'ap2',
        useTLS: true,
      });

      // aws s3

      // console.log(analysis?.images.image1);

      const s3bucket = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
      });

      // files.forEach(file => {
      for (let x = 0; x < files.length; x++) {
        s3bucket.createBucket(() => {
          // console.log('files', files[x]);
          const params = {
            Bucket: `photo-retouch/User_${analysis?.uploaded_by}/Doc_${analysis?._id}`,
            Key: files[x].fieldname,
            Body: files[x].buffer,
            ACL: 'public-read',
            ContentType: files[x].type,
          };
          s3bucket.upload(params, async (err, fileData) => {
            const a = `images.image${x}.original`;
            const b = `images.image${x}.status`;
            const res = await this.analysisModel.findByIdAndUpdate(
              analysis._id,
              { $set: { [a]: fileData?.Location } },
              // { $set: { [a]: fileData?.Location, [b]: 'processing' } },
            );

            pusher.trigger('my-channel', 'my-event', {
              message: res,
            });
            // console.log('Success', res);
            if (err) {
              return console.log('Error in callback: ', err);
            }
          });
        });
      }
      return {
        analysis: analysis,
        updateCredits: updateCredits,
      };
    } catch (error) {
      console.log('error', error);
    }
  }
  /*************************** get all analysiss of a user ***************************/
  async getAllAnalysisOfUser(userId): Promise<any> {
    let analysis;
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
    ////console.log('analysiss', analysiss);
    return analysis;
  }

  /*************************** get single analysiss  ***************************/
  async getSingleAnalysis(analysisId): Promise<any> {
    let analysis;
    if (analysisId.match(/^[0-9a-fA-F]{24}$/)) {
      analysis = await this.analysisModel
        .findOne({ _id: analysisId })
        .populate('uploaded_by');
    } else {
      throw new BadRequestException('Invalid analysis id');
    }
    if (analysis.length === 0) {
      throw new NotFoundException('No analysis found');
    }
    ////console.log('analysiss', analysiss);
    return analysis;
  }

  /*************************** delete single image  ***************************/
  async deleteImage(analysisId, image): Promise<any> {
    let analysis;
    let newAnalysis;
    let name = image.split('/').pop();
    console.log(image , analysisId)

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
    if (Object.keys(analysis?.images).length ===0){
      console.log(Object.keys(analysis?.images).length)
      await this.analysisModel.findByIdAndDelete(analysisId)
      newAnalysis = null
      console.log('deleted successfully')
      return null
    }
    return newAnalysis;
    // console.log('analysiss',newAnalysis);
  }

  /*************************** delete single image from all images ***************************/
  async deleteFromAllAnalysis(image): Promise<any> {
    let analysis;
    let newAnalysis;
    let name = image?.original.split('/').pop();

    console.log('image: ' + image);

    analysis = await this.analysisModel.findOne({ _id: image.documentId });
    if (analysis) {
      delete analysis?.images?.[name];
      newAnalysis = await this.analysisModel.findByIdAndUpdate(
        image.documentId,
        analysis,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
    }
    console.log('deleted successfully',Object.keys(analysis?.images).length , analysis)

    if (Object.keys(analysis?.images).length ===0){
      await this.analysisModel.findByIdAndDelete(image.documentId)
      console.log('deleted successfully')
    }
    return image;
  }

  async deleteMultipleAnalysis(images): Promise<any> {
    let analysis;
    let newAnalysis;
    let arrayAnalysis = [];
    console.log('images', images);
    await Promise.all(
      images.map(async (image) => {
        arrayAnalysis.push['deleted'];
        let name = image?.original.split('/').pop();
        console.log('name', name);
        analysis = await this.analysisModel.findOne({ _id: image.documentId });
        return new Promise(async (resolve, reject) => {
          if (analysis) {
            delete analysis?.images?.[name];
            newAnalysis = await this.analysisModel.findByIdAndUpdate(
              image.documentId,
              analysis,
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
              },
            );
            resolve(newAnalysis);
            arrayAnalysis.push(image);
          }
          if (Object.keys(analysis?.images).length ===0){
            await this.analysisModel.findByIdAndDelete(image.documentId)
            console.log('deleted successfully')
          }
        });
      }),
    );
    return arrayAnalysis;
  }
}

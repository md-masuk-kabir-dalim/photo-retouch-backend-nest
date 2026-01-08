/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Services } from 'src/services/services.schema';
import { Shop } from 'src/shop/shop.schema';
import { Measurement } from './measurement.schema';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectModel('Measurement')
    private readonly measurementModel: Model<Measurement>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>, // @InjectModel('Services') private readonly servicesModel: Model<Services>,
  ) {}
  /*************************** create a folder ***************************/
  async createMeasurement(req: { shop: any }): Promise<any> {
    let shop;
    shop = await this.shopModel.findOne({ name: req.shop });
    // let services
    // services = await this.servicesModel.findOne({name : req.service})
    const newMeasurement = new this.measurementModel({ ...req, shop: shop });
    console.log('new model : ', newMeasurement);
    return await newMeasurement.save();
  }

  async getMeasurement(measurementId: string): Promise<any> {
    let measurement;
    if (measurementId.match(/^[0-9a-fA-F]{24}$/)) {
      measurement = await this.measurementModel
        .find({ _id: measurementId })
        .populate('shop');
    } else {
      throw new BadRequestException('Invalid measurement id');
    }

    ////console.log('files', files);
    return measurement;
  }

  async updateMeasurement(measurementId: String, measurementData: any) {
    let updatedMeasurement;
    let response;
    try {
      updatedMeasurement = await this.measurementModel.findOne({
        _id: measurementId,
      });
    } catch (err) {
      throw new NotFoundException('User does not exist');
    }
    console.log('updatedMeasurement', updatedMeasurement);
    const newMeasurement = {
      ...updatedMeasurement._doc,
      ...measurementData,
    };

    try {
      response = await (
        await this.measurementModel.findOneAndUpdate(
          { _id: measurementId },
          newMeasurement,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        )
      ).populate('shop');
    } catch (err) {
      throw new NotFoundException('measurement not Found');
    }

    console.log('response', response);

    return response;
  }

  async deleteMeasurement(measurementId: string): Promise<any> {
    let measurement;

    try {
      measurement = await this.measurementModel.findById(measurementId).exec();
    } catch (error) {
      throw new NotFoundException('measurement not found');
    }
    if (measurement) {
      await this.measurementModel.findByIdAndDelete(measurementId);
      return 'Measurement deleted successfully';
    }
  }

  async getAllMeasurementsOfShop(shopId: string): Promise<any> {
    let shopMeasurement;
    if (shopId.match(/^[0-9a-fA-F]{24}$/)) {
      shopMeasurement = await this.measurementModel
        .find({ shop: shopId })
        .populate('shop');
    } else {
      throw new BadRequestException('Invalid measurement id');
    }

    ////console.log('files', files);
    return shopMeasurement;
  }

  /*************************** get all projects ***************************/
  // async getAllProjects(id, isAdmin, parent_folder) {
  //   console.log('id', id);
  //   let projects;
  //   //to see if id is a valid ObjectId or not (if not then throw error)
  //   if (isAdmin) {
  //     if (id.match(/^[0-9a-fA-F]{24}$/)) {
  //       projects = await this.folderModel
  //         .find({
  //           organization: id,
  //           project: true,
  //           parent_folder: parent_folder,
  //         })
  //         .populate('created_by');
  //     } else {
  //       throw new BadRequestException('Invalid organization id');
  //     }
  //   } else if (!isAdmin) {
  //     if (id.match(/^[0-9a-fA-F]{24}$/)) {
  //       projects = await this.folderModel
  //         .find({
  //           created_by: id,
  //           project: true,
  //           parent_folder: parent_folder,
  //         })
  //         .populate('created_by');
  //     } else {
  //       throw new BadRequestException('Invalid user id');
  //     }
  //   }
  //   if (projects.length === 0) {
  //     throw new NotFoundException('No projects found');
  //   }
  //   console.log('projects', projects);
  //   return projects;
  // }

  // /*************************** get all folders of a particular folder ***************************/
  // async getFoldersOfFolder(folderId) {
  //   console.log('folderId', folderId);
  //   let folders;
  //   //to see if id is a valid ObjectId or not (if not then throw error)
  //   if (folderId.match(/^[0-9a-fA-F]{24}$/)) {
  //     folders = await this.folderModel
  //       .find({
  //         parent_folder: folderId,
  //         project: false,
  //       })
  //       .populate('created_by');
  //   } else {
  //     throw new BadRequestException('Invalid folder id');
  //   }
  //   if (folders.length === 0) {
  //     throw new NotFoundException('No folders found');
  //   }
  //   console.log('folders', folders);
  //   return folders;
  // }

  // async getAllFoldersOfApp() {
  //   let folders = []
  //   try {
  //     const totalFolders = await this.folderModel.find();
  //     console.log('nameExist', totalFolders);
  //     // if (!totalOrganizations) {
  //     //   const newOrg = new this.orgModel({ name });
  //     //   const org = await this.orgModel.create(newOrg);
  //     //   return { org, status: 'success' };
  //     // } else {
  //     //   return { status: 'fail', message: 'Organization name already exist' };
  //     // }
  //     return totalFolders
  //   } catch (error) {
  //     console.log(error);
  //     throw [404, error.message];
  //   }
  // }
}

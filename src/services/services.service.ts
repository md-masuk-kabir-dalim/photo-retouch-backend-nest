/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measurement } from 'src/measurement/measurement.schema';
import { Shop } from 'src/shop/shop.schema';
import { Services } from './services.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel('Services') private readonly servicesModel: Model<Services>,
    @InjectModel('Measurement')
    private readonly measurementModel: Model<Measurement>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
  ) {}
  /*************************** create a folder ***************************/
  async createServices(req): Promise<any> {
    console.log('create services', req);
    let measurement;
    measurement = await this.measurementModel.findOne({
      name: req.measurement_fields,
    });
    let shop;
    shop = await this.shopModel.findOne({ name: req.shop });
    console.log('new', measurement);
    const newServices = new this.servicesModel({
      ...req,
      measurement_fields: measurement,
      shop: shop,
    });
    console.log('new model : ', newServices);
    return await newServices.save();
  }

  async getServices(servicesId: string): Promise<any> {
    let services;
    if (servicesId.match(/^[0-9a-fA-F]{24}$/)) {
      services = await this.servicesModel
        .find({ _id: servicesId })
        .populate('measurement');
    } else {
      throw new BadRequestException('Invalid services id');
    }

    ////console.log('files', files);
    return services;
  }

  async updateServices(servicesId, servicesData) {
    let updatedServices;
    let response;
    try {
      updatedServices = await this.servicesModel.findOne({
        _id: servicesId,
      });
    } catch (err) {
      throw new NotFoundException('User does not exist');
    }
    console.log('updatedServices', updatedServices);
    const newServices = {
      ...updatedServices._doc,
      ...servicesData,
    };

    try {
      response = await (
        await this.servicesModel.findOneAndUpdate(
          { _id: servicesId },
          newServices,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        )
      ).populate('measurement');
    } catch (err) {
      throw new NotFoundException('services not Found');
    }

    console.log('response', response);

    return response;
  }

  async deleteServices(servicesId: string): Promise<any> {
    let services;

    try {
      services = await this.servicesModel.findById(servicesId).exec();
    } catch (error) {
      throw new NotFoundException('services not found');
    }
    if (services) {
      await this.servicesModel.findByIdAndDelete(servicesId);
      return 'services deleted successfully';
    }
  }

  async getAllServicesOfShop(shopId: string): Promise<any> {
    let shopServices;
    if (shopId.match(/^[0-9a-fA-F]{24}$/)) {
      shopServices = await this.servicesModel
        .find({ shop: shopId })
        .populate('shop')
        .populate('measurement_fields');
    } else {
      throw new BadRequestException('Invalid measurement id');
    }

    ////console.log('files', files);
    return shopServices;
  }
}

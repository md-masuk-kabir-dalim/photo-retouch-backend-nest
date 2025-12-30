/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Shop } from './shop.schema';

@Injectable()
export class ShopService {
  constructor(@InjectModel('Shop') private readonly shopModel: Model<Shop>) {}

  /*************************************** add new shop ****************************************************/
  async addShop(shop) {
    console.log('shop', shop);
    let { name } = shop;
    console.log('name', name);
    try {
      const nameExist = await this.shopModel.findOne({ name });
      console.log('nameExist', nameExist);
      if (!nameExist) {
        const newShop = new this.shopModel({ name });
        const shop = await this.shopModel.create(newShop);
        return { shop, status: 'success' };
      } else {
        return { status: 'fail', message: 'Shop name already exist' };
      }
    } catch (error) {
      console.log(error);
      throw [404, error.message];
    }
  }
  async getAllShops() {
    let shopanizations = [];
    try {
      const totalShops = await this.shopModel.find();
      console.log('nameExist', totalShops);
      return totalShops;
    } catch (error) {
      console.log(error);
      throw [404, error.message];
    }
  }
}

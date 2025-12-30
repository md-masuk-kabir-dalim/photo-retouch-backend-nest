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
import { Order } from 'src/order/order.schema';
import { Shop } from 'src/shop/shop.schema';
import { Customer } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}
  /*************************** create a folder ***************************/
  async createCustomer(req): Promise<any> {
    let shop;
    shop = await this.shopModel.findOne({ name: req.shop });
    console.log('new', shop);
    const newCustomer = new this.customerModel({ ...req, shop: shop });
    console.log('new model : ', newCustomer);
    return await newCustomer.save();
  }

  async getCustomer(customerId: string): Promise<any> {
    let customer;
    let orders;
    if (customerId.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await this.customerModel
        .find({ _id: customerId })
        .populate('shop');

      orders = await this.orderModel.find({ customer: customer._id });

      console.log('orders', orders);
    } else {
      throw new BadRequestException('Invalid customer id');
    }

    ////console.log('files', files);
    return customer;
  }

  async updateCustomer(customerId, customerData) {
    let updatedCustomer;
    let response;
    try {
      updatedCustomer = await this.customerModel.findOne({
        _id: customerId,
      });
    } catch (err) {
      throw new NotFoundException('User does not exist');
    }
    console.log('updatedCustomer', updatedCustomer);
    const newCustomer = {
      ...updatedCustomer._doc,
      ...customerData,
    };

    try {
      response = await (
        await this.customerModel.findOneAndUpdate(
          { _id: customerId },
          newCustomer,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        )
      ).populate('shop');
    } catch (err) {
      throw new NotFoundException('customer not Found');
    }

    console.log('response', response);

    return response;
  }

  async deleteCustomer(customerId: string): Promise<any> {
    let customer;

    try {
      customer = await this.customerModel.findById(customerId).exec();
    } catch (error) {
      throw new NotFoundException('customer not found');
    }
    if (customer) {
      await this.customerModel.findByIdAndDelete(customerId);
      return 'customer deleted successfully';
    }
  }

  async getAllCustomersOfShop(shopId: string): Promise<any> {
    let shopCustomers;
    if (shopId.match(/^[0-9a-fA-F]{24}$/)) {
      shopCustomers = await this.customerModel
        .find({ shop: shopId })
        .populate('shop');
    } else {
      throw new BadRequestException('Invalid measurement id');
    }

    ////console.log('files', files);
    return shopCustomers;
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

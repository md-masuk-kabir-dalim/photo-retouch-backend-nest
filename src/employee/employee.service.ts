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
import { Shop } from 'src/shop/shop.schema';
import { Employee } from './employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
    @InjectModel('Shop') private readonly shopModel: Model<Shop>,
  ) {}
  /*************************** create a folder ***************************/
  async createEmployee(req): Promise<any> {
    let shop;
    shop = await this.shopModel.findOne({ name: req.shop });
    console.log('new', shop);
    const newEmployee = new this.employeeModel({ ...req, shop: shop });
    console.log('new model : ', newEmployee);
    return await newEmployee.save();
  }

  async getEmployee(employeeId: string): Promise<any> {
    let employee;
    if (employeeId.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await this.employeeModel
        .find({ _id: employeeId })
        .populate('shop');
    } else {
      throw new BadRequestException('Invalid employee id');
    }

    ////console.log('files', files);
    return employee;
  }

  async updateEmployee(employeeId, employeeData) {
    let updatedEmployee;
    let response;
    try {
      updatedEmployee = await this.employeeModel.findOne({
        _id: employeeId,
      });
    } catch (err) {
      throw new NotFoundException('User does not exist');
    }
    console.log('updatedEmployee', updatedEmployee);
    const newEmployee = {
      ...updatedEmployee._doc,
      ...employeeData,
    };

    try {
      response = await (
        await this.employeeModel.findOneAndUpdate(
          { _id: employeeId },
          newEmployee,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        )
      ).populate('shop');
    } catch (err) {
      throw new NotFoundException('employee not Found');
    }

    console.log('response', response);

    return response;
  }

  async deleteEmployee(employeeId: string): Promise<any> {
    let employee;

    try {
      employee = await this.employeeModel.findById(employeeId).exec();
    } catch (error) {
      throw new NotFoundException('employee not found');
    }
    if (employee) {
      await this.employeeModel.findByIdAndDelete(employeeId);
      return 'Employee deleted successfully';
    }
  }

  async getAllEmployeesOfShop(shopId: string): Promise<any> {
    let shopEmployee;
    if (shopId.match(/^[0-9a-fA-F]{24}$/)) {
      shopEmployee = await this.employeeModel
        .find({ shop: shopId })
        .populate('shop');
    } else {
      throw new BadRequestException('Invalid measurement id');
    }

    ////console.log('files', files);
    return shopEmployee;
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

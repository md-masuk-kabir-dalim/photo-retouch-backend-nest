/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Req() req: Request) {
    console.log('req.body', req.body);
    return await this.customerService.createCustomer(req.body);
  }

  @Get('/getCustomer/:id')
  async getCustomer(@Param('id') customerId: string) {
    const result = await this.customerService.getCustomer(customerId);
    return result;
  }

  @Patch('updateCustomer')
  async updateCustomer(
    @Body('id') customerId: String,
    @Body('customerData') customerData,
  ) {
    const result = await this.customerService.updateCustomer(
      customerId,
      customerData,
    );
    return result;
  }

  @Delete('/deleteCustomer/:id')
  async deleteCustomer(@Param('id') customerId: string) {
    return await this.customerService.deleteCustomer(customerId);
  }

  @Get('/getAllCustomersOfShop/:id')
  async getAllCustomersOfShop(@Param('id') shopId: string) {
    const result = await this.customerService.getAllCustomersOfShop(shopId);
    return result;
  }

  // @Post('getAllProjects')
  // async getAllProjects(@Body('id') id: string, @Body('isAdmin') isAdmin: boolean,@Body('parent_folder') parent_folder: string) {
  //   console.log('id', id);
  //   console.log('isAdmin', isAdmin);
  //   const result = await this.folderService.getAllProjects(id, isAdmin, parent_folder);
  //   return result;
  // }

  // @Get('/getFoldersOfFolder/:id')
  // async getFoldersOfFolder(@Param('id') parentFolderId: string) {
  //   console.log('parentFolderId', parentFolderId);
  //   const result = await this.folderService.getFoldersOfFolder(parentFolderId);
  //   return result;
  // }

  // @Get('/getAllFoldersOfApp')
  // async getAllFoldersOfApp() {
  //   const result = await this.folderService.getAllFoldersOfApp();
  //   return result;
  // }
}

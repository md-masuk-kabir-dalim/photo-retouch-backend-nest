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
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req: Request) {
    console.log('req.body', req.body);
    return await this.orderService.createOrder(req.body);
  }

  @Get('/getOrder/:id')
  async getOrder(@Param('id') orderId: string) {
    const result = await this.orderService.getOrder(orderId);
    return result;
  }

  @Patch('updateOrder')
  async updateOrder(@Body('id') orderId: String, @Body('orderData') orderData) {
    const result = await this.orderService.updateOrder(orderId, orderData);
    return result;
  }

  @Delete('/deleteOrder/:id')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.orderService.deleteOrder(orderId);
  }

  @Get('/getAllOrdersOfShop/:id')
  async getAllOrdersOfShop(@Param('id') shopId: string) {
    const result = await this.orderService.getAllOrdersOfShop(shopId);
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

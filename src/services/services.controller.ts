/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */

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
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createServices(@Req() req: Request) {
    console.log('req.body', req.body);
    return await this.servicesService.createServices(req.body);
  }

  @Get('/getServices/:id')
  async getServices(@Param('id') servicesId: string) {
    const result = await this.servicesService.getServices(servicesId);
    return result;
  }

  @Patch('updateServices')
  async updateServices(
    @Body('id') servicesId: String,
    @Body('servicesData') servicesData,
  ) {
    const result = await this.servicesService.updateServices(
      servicesId,
      servicesData,
    );
    return result;
  }

  @Delete('/deleteServices/:id')
  async deleteServices(@Param('id') servicesId: string) {
    return await this.servicesService.deleteServices(servicesId);
  }

  @Get('/getAllServicesOfShop/:id')
  async getAllServicesOfShop(@Param('id') shopId: string) {
    const result = await this.servicesService.getAllServicesOfShop(shopId);
    return result;
  }
}

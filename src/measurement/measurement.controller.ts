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
import { MeasurementService } from './measurement.service';

@Controller('measurement')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  async createMeasurement(@Req() req: Request) {
    console.log('req.body', req.body);
    return await this.measurementService.createMeasurement(req.body);
  }

  @Get('/getMeasurement/:id')
  async getMeasurement(@Param('id') measurementId: string) {
    const result = await this.measurementService.getMeasurement(measurementId);
    return result;
  }

  @Patch('updateMeasurement')
  async updateMeasurement(
    @Body('id') measurementId: String,
    @Body('measurementData') measurementData,
  ) {
    const result = await this.measurementService.updateMeasurement(
      measurementId,
      measurementData,
    );
    return result;
  }

  @Delete('/deleteMeasurement/:id')
  async deleteMeasurement(@Param('id') measurementId: string) {
    return await this.measurementService.deleteMeasurement(measurementId);
  }

  @Get('/getAllMeasurementsOfShop/:id')
  async getAllMeasurementsOfShop(@Param('id') shopId: string) {
    const result = await this.measurementService.getAllMeasurementsOfShop(
      shopId,
    );
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

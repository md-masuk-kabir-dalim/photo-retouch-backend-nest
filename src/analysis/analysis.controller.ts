/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Request } from 'express';
import { AnalysisService } from './analysis.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('sendAnalysis')
  @UseInterceptors(AnyFilesInterceptor())
  async sendAnalysis(@UploadedFiles() file, @Req() req: Request) {
    const data = await this.analysisService.sendAnalysis(file, req.body);
    return data;
  }

  @Get('/getAllAnalysisOfUser/:id')
  async getAllAnalysisOfUser(@Param('id') userId: string) {
    const result = await this.analysisService.getAllAnalysisOfUser(userId);
    return result;
  }

  @Get('/getSingleAnalysis/:id')
  async getSingleAnalysis(@Param('id') analysisId: string) {
    const result = await this.analysisService.getSingleAnalysis(analysisId);
    return result;
  }

  @Post('/deleteImage')
  async deleteImage(
    @Body('analysisId') analysisId: String,
    @Body('image') image: String,
  ) {
    const result = await this.analysisService.deleteImage(analysisId, image);
    return result;
  }

  @Post('/deleteFromAllAnalysis')
  async deleteFromAllAnalysis(
    @Body('image') image: { documentId: string; imageKey: string },
  ) {
    const result = await this.analysisService.deleteFromAllAnalysis(image);
    return result;
  }

  @Post('/deleteMultipleAnalysis')
  async deleteMultipleAnalysis(@Body('images') images) {
    const result = await this.analysisService.deleteMultipleAnalysis(images);
    console.log(result);
    return result;
  }
}

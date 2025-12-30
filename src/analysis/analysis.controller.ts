import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import { Request } from 'express';
import { AnalysisService } from './analysis.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('sendAnalysis')
  @UseInterceptors(AnyFilesInterceptor())
  async sendAnalysis(  @UploadedFiles() file , @Req() req: Request  ) {
    const data =  await this.analysisService.sendAnalysis(file , req.body);
    console.log(data);
    return data
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
  async deleteImage(@Body('analysisId') analysisId: String, @Body('image') image  :String) {
    const result = await this.analysisService.deleteImage(analysisId , image);
    return result;
  }

  @Post('/deleteFromAllAnalysis')
  async deleteFromAllAnalysis(@Body('image') image  :String) {
    const result = await this.analysisService.deleteFromAllAnalysis(image);
    return result;
  }

  @Post('/deleteMultipleAnalysis')
  async deleteMultipleAnalysis(@Body('images') images ) {
    const result = await this.analysisService.deleteMultipleAnalysis(images);
    console.log(result)
    return result;
  }

  
  

  // @Get('/getAllAnalysissOfOrganization/:id')
  // async getAllAnalysissOfOrganization(@Param('id') organization: string ) {
  //   const result = await this.analysisService.getAllAnalysissOfOrganization(organization);
  //   return result;
  // }
  // @Delete('/deleteAnalysis/:id')
  // async deleteAnalysis(@Param('id') analysisId: string) {
  //   return await this.analysisService.deleteAnalysis(analysisId);
  // }
  // @Patch('/nanoNetApi')
  // async nanoNetApi(@Body() ids: any): Promise<any> {
  //   try {
  //     const num = await this.analysisService.nanoNetApi(ids);
  //     // console.log('num', num);
  //     return num
  //   } catch (error) {
  //     console.log('errorr in controller', error);
  //     return error
  //   }
  // }
  // @Post('/getAllAnalysissOfFolderIds')
  // async getAllAnalysissOfFolderIds(@Body("ids") ids: Array<string> ) {
  //   return await this.analysisService.getAllAnalysissOfMultipleFolderIds(ids);
  // }

  // @Get('/getAllAnalysissOfApp')
  // async getAllAnalysissOfApp() {
  //   const result = await this.analysisService.getAllAnalysissOfApp();
  //   return result;
  // }
}
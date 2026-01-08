/* eslint-disable prettier/prettier */
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
import { Models } from './models.schema';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel('Models') private readonly modelsModel: Model<Models>,
  ) {}
  /*************************** create a folder ***************************/

  /*************************** get all projects ***************************/
  async getAllModels() {
    let models;
    models = await this.modelsModel.find();
    console.log('projects', models);
    return models;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  async addShop(@Body('name') name: string) {
    const result = await this.shopService.addShop(name);
    return result;
  }
  @Get('/getAllShops')
  async getAllShops() {
    const result = await this.shopService.getAllShops();
    return result;
  }
}

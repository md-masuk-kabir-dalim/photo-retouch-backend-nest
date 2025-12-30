/* eslint-disable prettier/prettier */
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesSchema } from './services.schema';
import { MeasurementService } from 'src/measurement/measurement.service';
import { MeasurementSchema } from 'src/measurement/measurement.schema';
import { ShopService } from 'src/shop/shop.service';
import { ShopSchema } from 'src/shop/shop.schema';
import { MeasurementModule } from 'src/measurement/measurement.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [
    // MeasurementModule,
    // ShopModule,
    MongooseModule.forFeature([
      { name: 'Services', schema: ServicesSchema },
      {
        name: 'Measurement',
        schema: MeasurementSchema,
      },
      {
        name: 'Shop',
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, MeasurementService, ShopService],
})
export class ServicesModule {}

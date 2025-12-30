/* eslint-disable prettier/prettier */
import { AuthSchema } from './../auth/auth.schema';
import { OrgSchema } from './../organization/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { MeasurementController } from './measurement.controller';
import { MeasurementSchema } from './measurement.schema';
import { ShopModule } from 'src/shop/shop.module';
import { ShopSchema } from 'src/shop/shop.schema';
import { ServicesModule } from 'src/services/services.module';
import { ServicesSchema } from 'src/services/services.schema';

@Module({
  imports: [
    ShopModule,
    // ServicesModule,
    MongooseModule.forFeature([
      { name: 'Measurement', schema: MeasurementSchema },
      {
        name: 'Shop',
        schema: ShopSchema,
      },
      {
        name: 'Services',
        schema: ServicesSchema,
      },
      // { name: 'Organization', schema: OrgSchema },
      // { name: 'Auth', schema: AuthSchema },
      // { name: 'Models', schema: ModelsSchema },
    ]),
  ],
  controllers: [MeasurementController],
  providers: [MeasurementService],
})
export class MeasurementModule {}

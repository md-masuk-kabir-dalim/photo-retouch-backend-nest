/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { FolderModule } from './folder/folder.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgModule } from './organization/organization.module';
import { FileModule } from './file/file.module';
import { ModelsModule } from './models/models.module';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { MeasurementModule } from './measurement/measurement.module';
import { EmployeeModule } from './employee/employee.module';
import { ShopModule } from './shop/shop.module';
import { ServicesModule } from './services/services.module';
import { AnalysisModule } from './analysis/analysis.module';

require('dotenv').config({ path: './.env' });

@Module({
  imports: [
    // AuthModule,
    // OrgModule,
    // FolderModule,
    // FileModule,
    // ModelsModule,

    // OrderModule,
    // CustomerModule,
    // MeasurementModule,
    // EmployeeModule,
    AuthModule,
    AnalysisModule,
    // ShopModule,
    // ServicesModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

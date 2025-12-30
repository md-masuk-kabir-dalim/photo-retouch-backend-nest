/* eslint-disable prettier/prettier */
import { AuthSchema } from './../auth/auth.schema';
import { OrgSchema } from './../organization/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.schema';
import { EmployeeSchema } from 'src/employee/employee.schema';
import { CustomerModule } from 'src/customer/customer.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { CustomerService } from 'src/customer/customer.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomerSchema } from 'src/customer/customer.schema';
import { ShopSchema } from 'src/shop/shop.schema';
import { ShopModule } from 'src/shop/shop.module';
import { ServicesSchema } from 'src/services/services.schema';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [
    EmployeeModule,
    CustomerModule,
    ShopModule,
    // ServicesModule,
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      {
        name: 'Customer',
        schema: CustomerSchema,
      },
      {
        name: 'Employee',
        schema: EmployeeSchema,
      },
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
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

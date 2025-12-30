/* eslint-disable prettier/prettier */
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerSchema } from './customer.schema';
import { ShopModule } from 'src/shop/shop.module';
import { ShopService } from 'src/shop/shop.service';
import { ShopSchema } from 'src/shop/shop.schema';
import { OrderService } from 'src/order/order.service';
import { OrderSchema } from 'src/order/order.schema';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    // ShopModule,
    // OrderModule,
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      {
        name: 'Shop',
        schema: ShopSchema,
      },
      {
        name: 'Order',
        schema: OrderSchema,
      },
      // { name: 'Organization', schema: OrgSchema },
      // { name: 'Auth', schema: AuthSchema },
      // { name: 'Models', schema: ModelsSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, ShopService],
})
export class CustomerModule {}

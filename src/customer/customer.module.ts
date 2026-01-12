/* eslint-disable prettier/prettier */
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerSchema } from './customer.schema';
import { ShopService } from 'src/shop/shop.service';
import { ShopSchema } from 'src/shop/shop.schema';
import { OrderSchema } from 'src/order/order.schema';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, ShopService],
})
export class CustomerModule {}

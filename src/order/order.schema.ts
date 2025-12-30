/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const OrderSchema = new mongoose.Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  assignTo: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  services: { type: Schema.Types.ObjectId, ref: 'Services', required: true },

  deliveryDate: { type: Date },
  status: { type: String },
  reference: { type: String },
  priority: { type: String },
  taxes: { type: String },
  discount: { type: String },
  comments: { type: String },
  date: { type: Date },
});

export interface Order {
  customer: string;
  assignTo: string;
  deliveryDate: Date;
  reference: string;
  priority: string;
  services: string;
  taxes: string;
  discount: string;
  comments: string;
  shop: string;
}

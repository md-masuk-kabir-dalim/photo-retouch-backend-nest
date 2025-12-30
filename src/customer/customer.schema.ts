/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const CustomerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  dateOfBirth: { type: String },
  openingBalance: { type: String },
  address: { type: String },
  description: { type: String },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  // orders : {type : Array}
});

export interface Customer {
  phone: string;
  name: string;
  email: string;
  dateOfBirth: string;
  openingBalance: string;
  address: string;
  description: string;
  shop: string;
  // orders: []
}

/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ServicesSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
  price: { type: String },
  description: { type: String },
  isActive: { type: Boolean },
  measurement_fields: {
    type: Schema.Types.ObjectId,
    ref: 'Measurement',
    required: true,
  },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
});

export interface Services {
  name: string;
  code: string;
  price: string;
  description: string;
  isActive: boolean;
  measurement_fields: string;
  shop: string;
}

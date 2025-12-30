/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const MeasurementSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  type: { type: String },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  // services: { type: Schema.Types.ObjectId, ref: 'Services', required: true },
});

export interface Measurement {
  name: string;
  description: string;
  type: string;
  shop: string;
  // services : string,
}

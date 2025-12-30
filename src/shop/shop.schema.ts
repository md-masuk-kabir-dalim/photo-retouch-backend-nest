/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export interface Shop {
  name: string;
}

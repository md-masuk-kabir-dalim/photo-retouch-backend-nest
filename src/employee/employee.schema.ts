/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  dateOfBirth: { type: String },
  salary: { type: String },
  address: { type: String },
  password: { type: String },
  description: { type: String },
  picture: { type: String },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
});

export interface Employee {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  salary: string;
  address: string;
  password: string;
  description: string;
  picture: string;
  shop: string;
}

/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const AuthSchema = new mongoose.Schema({
  // name: { type: String, required: true},
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  hash: { type: String },
  credits: { type: Number },
  avatarUrl: { type: String },

  // shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
});

export interface Auth {
  // name: string;

  email: string;
  firstName: string;
  lastName: string;
  hash: string;
  credits: number;
  avatarUrl: string;
  // shopId: string;
}

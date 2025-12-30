/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ModelsSchema = new mongoose.Schema({
  model_name: { type: String },
  model: { type: Boolean },
  model_id: { type: String },
});

export interface Models {
  model_name: string;
  model: boolean;
  model_id: string;
}

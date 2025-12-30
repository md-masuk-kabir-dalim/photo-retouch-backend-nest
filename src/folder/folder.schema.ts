/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export interface Folder {
  name: string;
}

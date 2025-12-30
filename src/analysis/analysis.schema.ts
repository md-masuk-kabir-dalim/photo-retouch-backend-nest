import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const AnalysisSchema = new mongoose.Schema({
  filterName: { type: String,},
  // file_url: { type: String, required: true },
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  images : {type: Object}
});
export interface Analysis {
  filterName: string;
  // file_url: string;
 
  uploaded_by: string;
  images: any
  // images : object
 
}
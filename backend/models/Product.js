import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:100},
  category:{type:String,required:true,enum:['Nuts','Dry Fruits','Pulses','Groundnuts','Other']},
  price:{type:Number,required:true,min:1},
  unit:{type:String,required:true,trim:true,maxlength:30},
  image:{type:String,default:''},
  description:{type:String,default:'',maxlength:500},
  farmer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  active:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model('Product',productSchema);

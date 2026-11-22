import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},name:String,price:Number,quantity:{type:Number,min:1,required:true}}],
  address:{type:String,default:'',maxlength:500},
  total:{type:Number,required:true,min:0},
  status:{type:String,enum:['placed','paid','processing','shipped','delivered','cancelled'],default:'placed'},
  paymentStatus:{type:String,enum:['pending','paid'],default:'pending'},
  paymentId:{type:String,default:''}
},{timestamps:true});
export default mongoose.model('Order',orderSchema);

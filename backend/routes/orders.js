import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import {protect} from '../middleware/auth.js';
const router=express.Router();
async function buildItems(items){
  if(!Array.isArray(items)||!items.length||items.length>30)throw new Error('Your cart is empty or contains too many items.');
  const result=[];let total=0;
  for(const item of items){
    if(!mongoose.isValidObjectId(item.product))throw new Error('Invalid product in cart.');
    const quantity=Number(item.quantity);
    if(!Number.isInteger(quantity)||quantity<1||quantity>50)throw new Error('Invalid product quantity.');
    const p=await Product.findOne({_id:item.product,active:true});
    if(!p)throw new Error('A product in your cart is unavailable.');
    result.push({product:p._id,name:p.name,price:p.price,quantity});total+=p.price*quantity;
  }
  return {items:result,total};
}
router.post('/',protect,async(req,res)=>{
  try{const built=await buildItems(req.body.items);const order=await Order.create({user:req.user._id,...built,address:String(req.body.address||'').slice(0,500)});res.status(201).json(order);}
  catch(e){res.status(400).json({message:e.message||'Could not place order.'});}
});
router.get('/mine',protect,async(req,res)=>{
  try{res.json(await Order.find({user:req.user._id}).sort({createdAt:-1}).limit(50));}
  catch{res.status(500).json({message:'Could not load orders.'});}
});
export {buildItems};
export default router;

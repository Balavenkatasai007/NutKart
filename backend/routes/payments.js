import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import {protect} from '../middleware/auth.js';
import Order from '../models/Order.js';
import {buildItems} from './orders.js';
const router=express.Router();
function razorpayClient(){
  if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET)throw new Error('Razorpay test keys are not configured.');
  return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
}
router.post('/create-order',protect,async(req,res)=>{
  try{
    const built=await buildItems(req.body.items);
    const rp=razorpayClient();
    const order=await rp.orders.create({amount:Math.round(built.total*100),currency:'INR',receipt:`nk_${Date.now()}`});
    res.json({id:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID});
  }catch(e){res.status(400).json({message:e.message||'Could not create payment order.'});}
});
router.post('/verify',protect,async(req,res)=>{
  try{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,items,address}=req.body;
    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)return res.status(400).json({message:'Payment details are incomplete.'});
    const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const a=Buffer.from(expected);const b=Buffer.from(String(razorpay_signature));
    if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({message:'Payment signature verification failed.'});
    const built=await buildItems(items);
    const order=await Order.create({user:req.user._id,...built,address:String(address||'').slice(0,500),status:'paid',paymentStatus:'paid',paymentId:razorpay_payment_id});
    res.status(201).json(order);
  }catch(e){res.status(400).json({message:e.message||'Could not verify payment.'});}
});
export default router;

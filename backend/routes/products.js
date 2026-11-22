import express from 'express';
import Product from '../models/Product.js';
import {protect,allowRoles} from '../middleware/auth.js';
const router=express.Router();
router.get('/',async(req,res)=>{
  try{
    const filter={active:true};
    if(req.query.category)filter.category=req.query.category;
    if(req.query.search)filter.name={$regex:String(req.query.search).slice(0,60),$options:'i'};
    res.json(await Product.find(filter).populate('farmer','name').sort({createdAt:-1}).limit(100));
  }catch{res.status(500).json({message:'Could not load products.'});}
});
router.post('/',protect,allowRoles('farmer','admin'),async(req,res)=>{
  try{
    const {name,category,price,unit,image,description}=req.body;
    if(!name||!category||!price||!unit)return res.status(400).json({message:'Name, category, price and unit are required.'});
    const product=await Product.create({name,category,price:Number(price),unit,image,description,farmer:req.user._id});
    res.status(201).json(product);
  }catch{res.status(400).json({message:'Invalid product details.'});}
});
router.delete('/:id',protect,async(req,res)=>{
  try{
    const product=await Product.findById(req.params.id);
    if(!product)return res.status(404).json({message:'Product not found.'});
    if(req.user.role!=='admin'&&String(product.farmer)!==String(req.user._id))return res.status(403).json({message:'You cannot delete this product.'});
    await product.deleteOne();res.json({message:'Product deleted.'});
  }catch{res.status(400).json({message:'Invalid product id.'});}
});
export default router;

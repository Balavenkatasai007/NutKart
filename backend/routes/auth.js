import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router=express.Router();
const makeToken=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
router.post('/register',async(req,res)=>{
  try{
    const {name,email,password,role='customer'}=req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required.'});
    if(String(password).length<8) return res.status(400).json({message:'Password must be at least 8 characters.'});
    if(!['customer','farmer'].includes(role)) return res.status(400).json({message:'Invalid account type.'});
    const normalized=String(email).trim().toLowerCase();
    if(await User.findOne({email:normalized})) return res.status(409).json({message:'An account with this email already exists.'});
    const user=await User.create({name,email:normalized,password:await bcrypt.hash(password,12),role});
    res.status(201).json({token:makeToken(user._id),user:{_id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(e){res.status(500).json({message:'Registration failed.'});}
});
router.post('/login',async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim().toLowerCase();
    const user=await User.findOne({email}).select('+password');
    if(!user||!await bcrypt.compare(String(req.body.password||''),user.password)) return res.status(401).json({message:'Email or password is incorrect.'});
    res.json({token:makeToken(user._id),user:{_id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch{res.status(500).json({message:'Login failed.'});}
});
export default router;

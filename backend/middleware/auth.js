import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req,res,next){
  try{
    const header=req.headers.authorization||'';
    if(!header.startsWith('Bearer ')) return res.status(401).json({message:'Please log in.'});
    const decoded=jwt.verify(header.slice(7),process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id).select('-password');
    if(!req.user) return res.status(401).json({message:'Account not found.'});
    next();
  }catch{return res.status(401).json({message:'Invalid or expired session.'});}
}
export function allowRoles(...roles){
  return (req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({message:'You do not have permission for this action.'});
}

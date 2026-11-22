import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json({limit:'100kb'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:100}),authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',protectRoutePlaceholder,orderRoutes);
app.use('/api/payments',paymentRoutes);
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'NutKart API'}));
app.use((req,res)=>res.status(404).json({message:'Route not found.'}));
app.use((err,req,res,next)=>{console.error(err.message);res.status(500).json({message:'Internal server error.'});});
function protectRoutePlaceholder(req,res,next){next();}
const PORT=process.env.PORT||5000;
connectDB().then(()=>app.listen(PORT,()=>console.log(`NutKart API running on http://localhost:${PORT}`))).catch(err=>{console.error(err.message);process.exit(1);});

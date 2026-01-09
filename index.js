import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routers/user.router.js'
import movieRoutes from './routers/movie.router.js'
const app=express()
dotenv.config()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
const port=process.env.PORT||8000
connectDB()
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`)
})
app.get('/',(req,res)=>{
    res.send("Welcome to The movie server home page")
})


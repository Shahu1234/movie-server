import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

const app=express()
dotenv.config()

const port=process.env.PORT||8000
connectDB()
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`)
})
app.get('/',(req,res)=>{
    res.send("Welcome to The movie server home page")
})
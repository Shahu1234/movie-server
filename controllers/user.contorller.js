import { email, success } from 'zod';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { setErrorMap } from 'zod/v3';

const generateToken= (userid)=>{
    return jwt.sign(
        {userid},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES}
    );
}

export const register=async(req,res)=>{
    try {
        const {username,email}=req.body;
        const existingUser=await User.findOne({$or: [{email},{username}]});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:existingUser.email===email?"Email already Registered ":"Username already taken"
            });
        }
        const user=await User.create({
            name:req.body.name,
            username,
            email,
            password:req.body.password,
            role:req.body.role||'user'
        });
        const token=generateToken(user._id);
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite:'Strict',
            maxAge: 7*24*60*60*1000 //7 days
        });
        res.status(201).json({
            success:true,
            message:"User Registered Successfully",
            data:{
                user:{
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error registering user",
            error:error.message
        });
    }
};
export const login=async(req,res)=>{
    try{
        const {identifier,password}=req.body;
        const user= await User.findOne({
            $or :[ {email:identifier.toLowerCase()},{username:identifier.toLowerCase()} ]
        });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Invalid Username or Email"});    
        }
        const isVaid=await user.isPasswordValid(password);
        if(!isVaid){
        return res.status(401).json({
            success:false,
            message:"Invalid Password"
        });
        }
        const token=generateToken(user._id);
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'Strict',
            maxAge: 7*24*60*60*1000
        });
        res.status(200).json({
            success:true,
            message:'Login Successful',
            data:{
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    role:user.role
                },
                token
            }
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Error Logging in",
            error:error.message
        });
    }};

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token'),
        res.staus(200).json({
            success:true,
            message:'Logged Out Successfully'
        });
    } catch (error) {
        res.staus(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const getProfile=async(req,res)=>{
    try {
        res.status(200).json({
            success:true,
            data:{
                user:req.user
            }
        })
    } catch (error) {
        res.staus(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const deleteProfile=async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
    } catch (error) {
        res.staus(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};
export const updateProfile=async(req,res)=>{
     try {
        
         const user=await User.findByIdAndUpdate(
            req.user._id,
            {
                name:req.body.name,
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                role:req.body.role||'user'
            },
            {new:true,runValidators:true}
        );
        res.status(200).json({
            success:true,
            message:"User Updated Successfully",
            data:{user}
        })
    } catch (error) {
        res.staus(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};

export const getAllUsers=async (req,res)=>{
    try {
        const users=await User.find().sort({createdAt: -1});
        res.status(200).json({
            success:true,
            count:users.length,
            data:{users}
        });
    } catch (error) {
        res.staus(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
}
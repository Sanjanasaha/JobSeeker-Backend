import { catchAsyncErr } from "../middlewares/catchAsyncError.js";
import errorHANDLER from "../middlewares/error.js";
import { User } from "../models/user.js";
import {sendToken} from "../utils/jwtToken.js";

export const register=catchAsyncErr(async(req,res,next)=>{
    const {name, email,phone,role,password}=req.body;
    if(!name || !email || !phone || !role || !password){
        return next(new errorHANDLER("Please fill full registration form!"));
    }
    const isEmail=await User.findOne({email});
    if(isEmail){
        return next(new errorHANDLER("Email already exists!"));
    }
    const user=await User.create({
        name,
        email,
        phone,
        role,
        password,
    });
    // res.status(200).json({
    //     success :true,
    //     message:"User Registered",
    //     user,
    // });
    sendToken(user,200,res,"User Registered successfully!")
});

export const login=catchAsyncErr(async(req,res,next)=>{
    const {email,password,role}=req.body;
    if(!email || !password || !role){
        return next(
            new errorHANDLER("Please provide email,password and role",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(
            new errorHANDLER("Invalid email or password",400));
    }
    const isPasswordMatch=await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(
        new errorHANDLER("Invalid email or password",400));
    }
    if(user.role !==role){
        return next(
        new errorHANDLER("User with this role is not found",400));
    }
    sendToken(user,200,res,"User logged in successfully!");
});

export const logout=catchAsyncErr(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"User logged out successfully!",
    });
});

export const getUser=catchAsyncErr((req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success :true,
        user,
    });
});


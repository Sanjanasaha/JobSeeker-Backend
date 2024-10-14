import { catchAsyncErr } from "./catchAsyncError.js";
import errorHANDLER from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthorized=catchAsyncErr(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new errorHANDLER("User not authorized",400));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);
    next();
});
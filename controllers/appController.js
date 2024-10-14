import { catchAsyncErr } from "../middlewares/catchAsyncError.js";
import errorHANDLER from "../middlewares/error.js";
import { Application } from "../models/appSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/job.js";

export const employerGetAllApplications=catchAsyncErr(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Job Seeker"){
       return next(
        new errorHANDLER(
            "Job Seeker is not allowed to access this resources!",400));
    }
    const {_id}=req.user;
    const applications =await Application.find({'employerId.user':_id});
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobSeekererGetAllApplications=catchAsyncErr(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
       return next(
        new errorHANDLER(
            "Employer is not allowed to access this resources!",400));
    }
    const {_id}=req.user;
    const applications =await Application.find({'applicantId.user':_id});
    res.status(200).json({
        success:true,
        applications,
    });
});

export const jobSeekerDeleteApplication= catchAsyncErr(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
       return next(
        new errorHANDLER(
            "Employer is not allowed to access this resources!",400));
    }
    const {id}=req.params;
    const applications =await Application.findById(id);
    if(!applications){
        return next(
            new errorHANDLER("Oops, Application not Found!",404));
    } 
    await applications.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application deleted successfully!"
    });
});

export const postApplication= catchAsyncErr(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Employer"){
       return next(
        new errorHANDLER(
            "Employer is not allowed to access this resources!",400));
    }
    if(!req.files || Object.keys(req.files).length===0){
        return next(new errorHANDLER("Resume File Required"));
    }
    const {resume}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"];
    if(!allowedFormats.includes(resume.mimetype)){
        return next (new errorHANDLER("Invalid file type. Please upload a PNG, JPG or WEBP Format",400));
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error",cloudinaryResponse.error || "Unknown Cloudinary Error");
        return next(new errorHANDLER("Faile to upload resume",500));
    }
    const {name,email,coverLetter,phone,address,jobId}=req.body; 
    const applicantId={
        user:req.user._id,
        role:"Job Seeker",
    };
    if(!jobId){
        return next(new errorHANDLER(" Job not Found!",404));
    }
    const jobDetails=await Job.findById(jobId);
    if(!jobDetails){
        return next(new errorHANDLER(" Job not Found!",404));
    }
    const employerId={
        user:jobDetails.postedBy,
        role:"Employer",
    };
    if(
        !name ||
        !email ||
        !coverLetter ||
        !phone ||
        !address ||
        !applicantId ||
        !employerId ||
        !resume 
    ){
        return next(new errorHANDLER(" Please Fill in all Fields!",400));
    }
    const applications =await Application.create({
        name ,
        email ,
        coverLetter ,
        phone ,
        address ,
        applicantId ,
        employerId ,
        resume:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });
    res.status(200).json({
        success:true,
        message:"Application Submitted!",
        applications,
    });
});
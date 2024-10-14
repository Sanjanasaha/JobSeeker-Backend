import { catchAsyncErr } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/job.js";
import errorHANDLER from "../middlewares/error.js";


export const getAllJobs=catchAsyncErr(async(req,res,next)=>{
    const jobs=await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs,
    });
});

export const postJob=catchAsyncErr(async(req,res,next)=>{
    const{role}=req.user;
    if(role==="Job Seeker"){
       return next(
        new errorHANDLER(
            "Job Seeker is not allowed to access this resources!",400));
    }
    const{title , description , category , country ,city , location , fixedSalary , salaryFrom , salaryTo}=req.body;

    if(!title || !description || !category || !country || !city || !location ){
        return next(new errorHANDLER("Please provide full Job details!",400));
    }
    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new errorHANDLER("Please either provide fixed salary or ranged salary!",400));
    }
    if(salaryFrom && salaryTo && fixedSalary){
        return next(new errorHANDLER("Cannot enter fixed salary and ranged salary together!",400));

    }
    const postedBy=req.user._id;
    const job=await Job.create({
        title , 
        description , 
        category , 
        country ,
        city , 
        location , 
        fixedSalary , 
        salaryFrom , 
        salaryTo,
        postedBy
    });
    res.status(200).json({
        success:true,
        message:"Job posted successfully!",
        job,
    });
});

export const getMyJobs=catchAsyncErr(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next(
         new errorHANDLER(
             "Job Seeker is not allowed to access this resources!",400));
     }
    const myJobs=await Job.find({postedBy:req.user._id});
    res.status(200).json({
        success:true,
        myJobs,
    });
});

export const updateJob=catchAsyncErr(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next(
         new errorHANDLER(
             "Job Seeker is not allowed to access this resources!",400));
     }
    const {id}=req.params; 
    let job= await Job.findById(id);
    if(!job){
        return next(
            new errorHANDLER(
                "Oops, Job not Found!",404));
    }
    job = await Job.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        job,
        message:"Job updated successfully!"
    });
});

export const deleteJob=catchAsyncErr(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next(
         new errorHANDLER(
             "Job Seeker is not allowed to access this resources!",400));
     }
    const {id}=req.params; 
    
    let job= await Job.findById(id);
    if(!job){
        return next(
            new errorHANDLER(
                "Oops, Job not Found!",404));
    }

    await job.deleteOne();

    res.status(200).json({
        success:true,
        message:"Job deleted successfully!"
    });
});

export const getSinglejob=catchAsyncErr(async(req,res,next)=>{
    const {id}=req.params; 
    try{
        const job= await Job.findById(id);
        if(!job){
           return next( new errorHANDLER("Oops, Job not Found!",404));
        }
        res.status(200).json({
            success:true,
            job
        });
    }catch(error){
        return next( new errorHANDLER("Invalid Id/Cast Error!",400));
    }
});


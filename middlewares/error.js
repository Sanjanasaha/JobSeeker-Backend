class errorHANDLER extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal server error";
    err.statusCode=err.statusCode || 500;
    if (err.name==="CastError"){
        const message=`Resource not found . Invalid ${err.path}`;
        err=new errorHANDLER(message,400);
    }
    if (err.code===11000){
        const message=`Duplicate ${object.keys(err.keyValue)} Entered`;
        err=new errorHANDLER(message,400);
    }
    if (err.name==="JsonWebTokenError"){
        const message=`Json web token is Invalid. Try again`;
        err=new errorHANDLER(message,400);
    }
    if (err.name==="TokenExpiredError"){
        const message=`Json web token is Expired. Try again`;
        err=new errorHANDLER(message,400);
    }
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};

export default errorHANDLER;
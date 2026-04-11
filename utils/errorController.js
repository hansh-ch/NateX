const AppError = require("./appError");


function sendProductionError(err,res){
   
// We mark error created or thrown by us as operational as error could happen through 
            // 3rd party library
            if (err.isOperational) {
                res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
            }else{
                res.status(500).json({
                    status: 'error',
                    message: 'Something went wrong',
                });
            }
}


const errorHandler=(err,req,res,next)=>{
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
       // Sending different types of error based on environment
       if(process.env.NODE_ENV==="development"){
            res.status(err.statusCode).json({
                status: err.status,
                error: err,
                message: err.message,
                stack: err.stack,
            });  
       }else if(process.env.NODE_ENV==="production"){
            let error={...err}
            // Handling mongoDB error
            if(err.name === 'CastError' && err.kind === 'ObjectId'){
                function newError (e){
                    console.log("hello");
                    const message=`Invalid ${e.path}:${e.value}`
                    return new AppError(message,400)
                };
               
                error = newError(error)
            }

            // Duplicate Key Error
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                const message = `Duplicate field value entered: ${field}. Please use another value.`;
                error = new AppError(message,400);
            }



            sendProductionError(error,res);       
       }
}

module.exports=errorHandler
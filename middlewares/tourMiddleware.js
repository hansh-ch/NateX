/*====>    
Desc : Setting predefined query params 
<====*/


exports.aliasTopTours = function(req,res,next){
    req.query.limit= "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields="name,price,ratingsAverage,difficulty,summary";
    next();
    
 }
    

    
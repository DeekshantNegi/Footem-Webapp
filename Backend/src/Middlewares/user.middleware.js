// hashPassword, validate user data

const bcrypt = require("bcryptjs")

 


exports.isaccowner = (req,res,next)=>{
   if(req.user.userID !== req.params.id){
    throw new APIerror(403,"you can only modify your account");
   }
   next();
};
// hashPassword, validate user data

const bcrypt = require("bcryptjs")

exports.hashpassword = asynchandler(async (req,res,next)=>{

    try {
        if(!req.body.password) return next();
        const salt = await bcrypt.gensalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
        next();

    } catch (error) {
        throw new APIerror(500,"error hashing password");
    }

});


exports.isaccowner = (req,res,next)=>{
   if(req.user.userID !== req.params.id){
    throw new APIerror(403,"you can only modify your account");
   }
   next();
};
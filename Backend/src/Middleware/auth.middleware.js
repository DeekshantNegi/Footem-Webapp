//JWT, protect, authorize

const jwt = require("jsonwebtoken");

exports.protect = (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new APIerror(401,"Not Authorized");
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user=decode;

        next();
    } catch (error) {
        throw new APIerror(401,"Invalid or Expired Token");
    }
};

exports.authorize = (role)=>{
    return(req,res,next)=>{
        if(!req.user){
            throw new  APIerror(401,"Not Authorized");
        }

        if(req.user.role !== role){
            throw new APIerror(401,"Access Denied : Insuffucuent Permissions");
        }

        next();
    };
};
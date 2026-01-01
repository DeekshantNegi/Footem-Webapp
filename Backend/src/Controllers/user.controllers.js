

//register user
const registeruser = asyncHandler(async (req, res) => {

    /* Validate input fields */
    const{fullname, email, password}= req.body;

    if([fullname,email,password].some((field)=>field?.trim()==="")
    ){
         throw new APIerror(400,"All fields are required"); 
    }

    const existinguser = await User.findone({$or:[{email},{username}]})
    if(existinguser){
        throw new APIerror (409,"User already exists");
    }
    const hashedpassword = await bcrypt.hash(password,10);
    
})

//loginuser
const loginuser = asyncHandler( async (req,res)=>{

})

//logut user 

const logoutuser = asyncHandler( async (req,res)=>{

})

//user profile

const getuserprofile = asyncHandler( async (req,res)=>{

})

//change password

const changeuserpassword = asyncHandler( async (req,res)=>{

})
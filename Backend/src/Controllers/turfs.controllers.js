import {turf} from "../Models/turfs.models.js";


//create turf
const createTurf = asynchandler(async (req,res)=>{
  const {TurfName, location, city, description, priceperhour} = req.body;

  if([TurfName, location, city, priceperhour].some(field=> field?.trim() === "")){
    throw new ApiError(400, "All fields are required");
  }

  const turf = await turf.create({
    owner: req.user._id,
    TurfName,
    location,
    city,
    description,
    priceperhour
  });
  if(!turf){
    throw new ApiError(500, "Failed to create turf");
  }
  return res.status(201)
  .json(new ApiResponse(200, turf, "Turf created successfully"));
});  

//update turf 

const updateturf = asynchandler(async (req,res)=>{

});

//delete turf
const deleteturf = asynchandler(async (req,res)=>{

})

//get all turf
const getallturf = asynchandler(async (req,res)=>{

});

export {

}
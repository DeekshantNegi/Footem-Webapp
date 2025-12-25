const express = require("express")
const router = express.Router();

const{
   createturf,
   updateturf,
   deleteturf,
   getallturf,

} = require("../Controllers/turfs.controllers");

router.post("/createturf",createturf);
router.put("/updateturf",updateturf);
router.delete("/deleteturf",deleteturf);

router.get("/allturfs",getallturf);

module.exports = router;


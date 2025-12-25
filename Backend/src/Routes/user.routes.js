const express = require("express");
const router = express.Router();

//getting controllers
const{
    registeruser,
    loginuser,
    getuserprofile,
    changeuserpassword,
    logoutuser,
} = require("../Controllers/user.controllers");


router.post("/register",registeruser);
router.post("/login",loginuser);
router.post("logout",logoutuser);

router.get("/profile",getuserprofile);
router.put("/changepassword",changeuserpassword);

module.exports = router;
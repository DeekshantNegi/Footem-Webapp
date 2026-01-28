import express from "express";
const router = express.Router();

//getting controllers
const{
    registeruser,
    loginuser,
    getuserprofile,
    changeuserpassword,
    logoutuser,
} = require("../Controllers/user.controllers");


router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/logout").post(logoutuser);

router.route("/profile").get(getuserprofile);
router.route("/changepassword").put(changeuserpassword);

export default router;
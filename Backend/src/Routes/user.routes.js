import express from "express";
const router = express.Router();
import {verifyJWT} from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

//getting controllers
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
  updateProfile,
  updateUserAvatar,
  changeUserPassword,
} from "../Controllers/user.controller.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/userprofile").get( verifyJWT, getUserProfile).put( verifyJWT, updateProfile);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/change-password").put(verifyJWT, changeUserPassword);
 

export default router;

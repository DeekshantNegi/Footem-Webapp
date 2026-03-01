import express from "express";
import { verifyJWT, authorizeRoles } from "../Middlewares/auth.middleware.js";
import {
    applyForOwner,
    getMyOwnerProfile,

} from "../Controllers/owner.controller.js";

const router = express.Router();

// User applies to become owner
router.post("/apply", verifyJWT, applyForOwner);

// Get logged-in owner's profile
router.get("/me", verifyJWT, getMyOwnerProfile);

export default router;
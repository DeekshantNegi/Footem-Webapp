import express from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { applyForOwner, getMyOwnerProfile } from "../Controllers/owner.controller.js";

const router = express.Router();

// User applies to become owner — idProof arrives as a multipart file, not JSON.
router.post("/apply", verifyJWT, upload.single("idProof"), applyForOwner);

// Get the logged-in user's own owner application/profile, whatever its
// status. No authorizeRoles("owner") gate here on purpose — that middleware
// only passes for status === "verified", which would 403 out anyone who is
// still "pending" or "rejected" and needs to check their own status.
router.get("/me", verifyJWT, getMyOwnerProfile);

export default router;
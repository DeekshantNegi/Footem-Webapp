import express from "express";
import { verifyJWT, authorizeRoles } from "../Middlewares/auth.middleware.js";

import {
 getAllOwnerRequests,
    approveOwner,
    rejectOwner,
    getAllTurfs,
    deleteTurf,
} from "../Controllers/admin.controller.js";

const router = express.Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.get("/owner-requests", getAllOwnerRequests);
router.put("/approve-owner/:userId", approveOwner);
router.put("/reject-owner/:userId", rejectOwner);

router.get("/turfs", getAllTurfs);
router.delete("/turfs/:turfId", deleteTurf);

export default router;

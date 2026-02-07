 import express from "express";
const router = express.Router();
import { verifyJWT, authorizeRoles } from "../Middlewares/auth.middleware";





router.get("/", getAllTurfs);
router.route("/:id").get(getSingleTurf).put(verifyJWT, authorizeRoles("owner"), updateTurf).delete(verifyJWT, authorizeRoles("owner"), deleteTurf);
module.exports = router;


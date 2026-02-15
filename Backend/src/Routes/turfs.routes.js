 import express from "express";
const router = express.Router();
import { verifyJWT, authorizeRoles } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { 
    createTurf, 
    getSingleTurf,
    updateTurf,
    deleteTurf,
    getAllTurfs,
} from "../Controllers/turfs.controller.js";




router.get("/", getAllTurfs);
router.post("/create", upload.array("images",10), verifyJWT, authorizeRoles("owner"), createTurf);
router.route("/:id").get(getSingleTurf).put(verifyJWT, authorizeRoles("owner"), updateTurf).delete(verifyJWT, authorizeRoles("owner"), deleteTurf);
module.exports = router;


import express from "express";
const router = express.Router();
import { verifyJWT, authorizeRoles } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import {
  createTurf,
  getSingleTurf,
  updateTurf,
  deleteTurf,
  getMyTurfs,
  getAllTurfs,
  availableSlots,
} from "../Controllers/turfs.controller.js";

router.get("/", getAllTurfs);
router.get("/my-turfs", verifyJWT, authorizeRoles("owner"), getMyTurfs);
router.get('/:id/available-slots', availableSlots);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("owner"),
  upload.array("images", 10),
  createTurf,
);

router
  .route("/:id")
  .get(getSingleTurf)
  .put(
    verifyJWT,
    authorizeRoles("owner"),
    upload.array("images", 10),
    updateTurf,
  )
  .delete(verifyJWT, authorizeRoles("owner"), deleteTurf);

 

export default router;

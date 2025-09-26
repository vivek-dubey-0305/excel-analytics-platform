// routes/file.routes.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  uploadFile,
  getAllFilesByUser,
  getOneFile,
  deleteFile,
  updateFileMeta,
  countFiles,
  getFileColumns,
  getFileData,
  deleteAllFiles,
} from "../controllers/file.controller.js";

const router = express.Router();

// 🔒 All routes protected
router.use(verifyJWT);

router.route("/upload").post(upload.single("file"), uploadFile);
router.route("/total-files-count").get(countFiles);
router.route("/all").get(getAllFilesByUser);
router.delete("/delete-all", verifyJWT, deleteAllFiles);
router.route("/:id").get(getOneFile).delete(deleteFile).put(updateFileMeta);
router.route("/:id/columns").get(getFileColumns);
router.route("/:id/data").get(getFileData); // added below


export default router;

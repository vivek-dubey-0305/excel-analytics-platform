import express from "express";
import { customRoles, verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";
import {
    getAllUsers,
    getOneUser,
    adminUpdateUserProfile,
    adminUpdateUserAvatar,
    adminDeleteUser,
    getAllFiles,
    deleteFileByAdmin,
    getAllActivityLogs,
    clearUserLogs
} from "../controllers/admin.controller.js";

const router = express.Router()


// *all access
router.route("/get/user/all").get(verifyJWT, customRoles("admin"), getAllUsers)
router.route("/get/user/:id").get(verifyJWT, customRoles("admin"), getOneUser)
    .put(verifyJWT, customRoles("admin"), adminUpdateUserProfile)
    .delete(verifyJWT, customRoles("admin"), adminDeleteUser)


router.route("/edit/user/avatar/:id").put(verifyJWT, customRoles("admin"), upload.single("avatar"), adminUpdateUserAvatar)


// Files
router.route("/get/files/all").get(verifyJWT, customRoles("admin"), getAllFiles)
router.route("/delete/file/:fileId").delete(verifyJWT, customRoles("admin"), deleteFileByAdmin)

// Activity Logs
router.route("/get/activity-logs/all").get(verifyJWT, customRoles("admin"), getAllActivityLogs)
router.route("/clear/logs/:userId").delete(verifyJWT, customRoles("admin"), clearUserLogs)


export default router;
import express from "express";
import {
    confirmEmail,
    createUser,
    login,
    validateJWTAndReturnUserObject,
    inviteUser,
    getUserCount,
    getAllUsers,
    getRoleCount,
    getAllRoles,
    acceptInvite,
    getRolePermissions,
    getUserPermissions
} from "../controllers/user.js";
import {
    validate
} from "../validators/joiValidator.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/create", validate, createUser);
router.post("/login", validate, login);
router.get("/confirm/:token", confirmEmail);
router.post("/accept/:token", acceptInvite);

router.post("/validate/jwt", validate, validateJWTAndReturnUserObject);
router.post("/invite", authenticateUser, inviteUser);
router.get("/count", authenticateUser, getUserCount);
router.get("/", authenticateUser, getAllUsers);

router.get("/roles", authenticateUser, getAllRoles);
router.get("/roles/permissions/:id", authenticateUser, getRolePermissions);
router.get("/roles/count", authenticateUser, getRoleCount);

router.get("/permissions", authenticateUser, getUserPermissions);

export default router;
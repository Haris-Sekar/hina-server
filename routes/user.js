import express from "express";
import { confirmEmail, createUser, login } from "../controllers/user.js";
import { validate } from "../validators/joiValidator.js";

const router = express.Router();

router.post("/create", validate, createUser);
router.post("/login", validate, login);
router.get("/confirm/:token", confirmEmail);
export default router;

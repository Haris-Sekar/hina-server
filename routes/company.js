import express from "express";
import { validate } from "../validators/joiValidator.js";
import {
	createCompany,
	getCompanyDetails,
	validateGst,
} from "../controllers/company.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/create", validate, authenticateUser, createCompany);
router.get("/", validate, authenticateUser, getCompanyDetails);

router.get("/validate/gst", validate, validateGst);

export default router;

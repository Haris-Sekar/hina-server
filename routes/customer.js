import express from "express";
import { validate } from "../validators/joiValidator.js";
import authenticateUser from "../middleware/auth.js";
import { createCustomers } from "../controllers/customer.js";

const router = express.Router();

router.post("/create", validate, authenticateUser, createCustomers);
router.patch("/update/:id");
router.get("/");
router.get("/:id");
router.delete("/delete/:id");

export default router;

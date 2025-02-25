import express from "express";
import { validate } from "../validators/joiValidator.js";
import authenticateUser from "../middleware/auth.js";
import {
	createCustomers,
	getAllPaymentTerms,
	createPaymentTerms,
	deletePaymentTerms,
	editPaymentTerms,
	getCustomerCount,
	fetchCustomers,
	updateCustomer,
	deleteCustomers
} from "../controllers/customer.js";

const router = express.Router();

router.post("/create", validate, authenticateUser, createCustomers);
router.get("/count", authenticateUser, getCustomerCount);	
router.patch("/update/:id", authenticateUser, updateCustomer);
router.get("/", authenticateUser, fetchCustomers);
router.delete("/", authenticateUser, deleteCustomers);

router.get("/payment-terms", authenticateUser, getAllPaymentTerms);
router.post("/payment-terms", authenticateUser, createPaymentTerms);
router.patch("/payment-terms/:id", authenticateUser, editPaymentTerms);
router.delete("/payment-terms", authenticateUser, deletePaymentTerms);

export default router;

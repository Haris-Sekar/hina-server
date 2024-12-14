import axios from "axios";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import Organization from "../models/Organization.js";
import { seedValues } from "../utils/seedNewCompanyDBValues.js";
import { startTransaction } from "../config/db.js";

const validateGst = async (req, res) => {
	try {
		const { gst_number } = req.query;

		const response = await axios.get(
			`https://api-domain-name/commonapi/v1.3/search?gstin=${gst_number}`
		);
		return res.status(200).json(successResponse(response.data));
	} catch (error) {
		return res
			.status(500)
			.json(errorResponse("Failed to validate GST number", [], 500));
	}
};

const createCompany = async (req, res) => {
	let transaction;
	try {
		transaction = await startTransaction();
		const { name, description, gst_number } = req.body;
		const user_id = req.user.id;

		// Check if company with GST number already exists
		const existingCompany = await Organization.findOne({
			where: { gst_number },
			transaction
		});
		if (existingCompany) {
			await transaction.rollback();
			return res
				.status(400)
				.json(
					errorResponse("Company with this GST number already exists", [], 400)
				);
		}

		// Create new company
		const company = await Organization.create({
			name,
			description,
			gst_number,
			created_by: user_id,
		}, { transaction });

		await seedValues(user_id, company.id, transaction);

		await transaction.commit();
		return res.status(201).json(
			successResponse({
				message: "Company created successfully",
				company,
			})
		);
	} catch (error) {
		if (transaction) await transaction.rollback();
		console.error("Error creating company:", error);
		return res
			.status(500)
			.json(errorResponse("Failed to create company", [], 500));
	}
};

export { validateGst, createCompany };

import bcrypt from "bcryptjs";
import { Customer } from "../models/index.js";
import { successResponse } from "../utils/responseFormatter.js";
import { add } from "winston";
const createCustomers = async (req, res) => {
	try {
		const {
			name,
			display_name,
			email,
			phone,
			pan_card,
			billing_address,
			shipping_address,
			customer_code,
			customer_type,
			opening_balance,
		} = req.body;

		pan_card = await bcrypt.hash(pan_card, 10);

		const billingAddress = await Address.create({
			address_line_1: billing_address.line_1,
			address_line_2: billing_address.line_2,
			city: billing_address.city,
			state: billing_address.state,
			country: billing_address.country,
			zip_code: billing_address.zip_code,
			organization_id: req.user.organization_id,
			created_by: req.user.id,
			updated_by: req.user.id,
		});

		const shippingAddress = await Address.create({
			address_line_1: shipping_address.line_1,
			address_line_2: shipping_address.line_2,
			city: shipping_address.city,
			state: shipping_address.state,
			country: shipping_address.country,
			zip_code: shipping_address.zip_code,
			organization_id: req.user.organization_id,
			created_by: req.user.id,
			updated_by: req.user.id,
		});

		const customer = await Customer.create({
			customer_type,
			name,
			display_name,
			email,
			phone,
			pan_card,
			customer_code,
			opening_balance,
			billing_address_id: billingAddress.id,
			shipping_address_id: shippingAddress.id,
			created_by: req.user.id,
			updated_by: req.user.id,
		});
		res
			.status(201)
			.json(
				successResponse(customer.dataValues, "Customer created successfully")
			);
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to create customer", [error], 500));
	}
};

export { createCustomers };

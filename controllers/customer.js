import bcrypt from "bcryptjs";
import { Address, Customer, PaymentTerms, User } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { Op, Sequelize } from "sequelize";
const createCustomers = async (req, res) => {
	try {
		let {
			name,
			email,
			phone,
			pan_number,
			billing_address,
			shipping_address,
			customer_code,
			customer_type,
			opening_balance,
			tax_number,
			payment_terms,
		} = req.body;

		if (customer_code) {
			const exisitingCustomer = await Customer.findAll({
				where: {
					customer_code: customer_code,
					organization_id: req.org.id,
				},
			});
			if (exisitingCustomer.length > 0) {
				return res
					.status(409)
					.json(
						errorResponse(
							"A Customer is already present with this customer code",
							[],
							409
						)
					);
			}
		}

		if (pan_number) {
			pan_number = await bcrypt.hash(pan_number, 10);
		}

		let billingAddress;

		if (billing_address.line_1) {
			billingAddress = await Address.create({
				address_line_1: billing_address.line_1,
				address_line_2: billing_address.line_2,
				city: billing_address.city,
				state: billing_address.state,
				country: billing_address.country,
				zip_code: billing_address.zip_code,
				organization_id: req.org.id,
				created_by: req.user.id,
				updated_by: req.user.id,
			});
		}

		let shippingAddress;

		if (shipping_address.line_1) {
			shippingAddress = await Address.create({
				address_line_1: shipping_address.line_1,
				address_line_2: shipping_address.line_2,
				city: shipping_address.city,
				state: shipping_address.state,
				country: shipping_address.country,
				zip_code: shipping_address.zip_code,
				organization_id: req.org.id,
				created_by: req.user.id,
				updated_by: req.user.id,
			});
		}

		if (!customer_code) {
			customer_code = await generateCustomerCode(req.org.id);
		}

		const customer = await Customer.create({
			customer_type,
			name,
			email,
			phone,
			pan_number,
			customer_code,
			opening_balance,
			current_balance: opening_balance,
			tax_number,
			billing_address_id: billingAddress?.id,
			shipping_address_id: shippingAddress?.id,
			payment_terms: payment_terms,
			organization_id: req.org.id,
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

const getAllPaymentTerms = async (req, res) => {
	try {
		const terms = await PaymentTerms.findAll({
			where: {
				organization_id: req.org.id,
			},
		});
		if (!terms) {
			return res.status(204);
		}
		res
			.status(200)
			.json(successResponse(terms, "Payment terms successfully retrived"));
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to create customer", [error], 500));
	}
};

const createPaymentTerms = async (req, res) => {
	try {
		const { name, number_of_days, is_default } = req.body;
		if (is_default) {
			PaymentTerms.update(
				{
					is_default: false,
				},
				{
					where: {
						is_default: true,
						organization_id: req.org.id,
					},
				}
			);
		}

		const paymentTerms = await PaymentTerms.create({
			name,
			number_of_days,
			is_default,
			organization_id: req.org.id,
			created_by: req.user.id,
			updated_by: req.user.id,
		});
		res.status(201).json(successResponse(paymentTerms.dataValues));
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to create Payment terms", [error], 500));
	}
};

const editPaymentTerms = async (req, res) => {
	try {
		const { name, number_of_days, is_default } = req.body;
		const paymentTerms = await PaymentTerms.update(
			{
				name,
				number_of_days,
				is_default,
				updated_by: req.user.id,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);
		res.status(200).json(successResponse(paymentTerms[0]));
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to delete payment terms", [error], 500));
	}
};

const deletePaymentTerms = async (req, res) => {
	try {
		const { ids } = req.body;
		await PaymentTerms.destroy({
			where: {
				id: {
					[Op.in]: ids,
				},
			},
		});
		res.status(204).json({});
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to delete payment terms", [error], 500));
	}
};

const getCustomerCount = async (req, res) => {
	try {
		const count = await Customer.count({
			where: {
				organization_id: req.org.id,
			},
		});
		res.status(200).json(successResponse({ count }));
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to delete payment terms", [error], 500));
	}
};

const fetchCustomers = async (req, res) => {
	try {
		const {
			id,
			index = 1,
			range = 10,
			filters = {},
			sort_by = "created_time",
			sort_order = "DESC",
		} = req.query;

		if (id) {
			const customer = await Customer.findByPk(id, {
				include: [
					{
						model: Address,
						as: "billing_address", // Use the alias defined in the association
					},
					{
						model: Address,
						as: "shipping_address", // Use the alias defined in the association
					},
					{
						model: User,
						as: "created_by_user",
					},
					{
						model: User,
						as: "updated_by_user",
					},
				],
			});
			if (customer) {
				return res.status(200).json(successResponse({ customer }));
			}
		} else {
			const { count, rows } = await Customer.findAndCountAll({
				where: { ...filters, organization_id: req.org.id },
				limit: Number(range),
				offset: Number(index),
				order: [[sort_by, sort_order]],
				include: [
					{
						model: User,
						as: "created_by_user",
					},
					{
						model: User,
						as: "updated_by_user",
					},
				],
			});
			return res.status(200).json({
				page: { count, index, range },
				customers: rows,
			});
		}
		res.status(204).json({});
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to get customers", [error], 500));
	}
};

const updateCustomer = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			pan_number,
			billing_address,
			shipping_address,
			customer_type,
			payment_terms
		} = req.body;

		const {id} = req.params;

		if(billing_address && billing_address.id) {
			await Address.update({
				address_line_1: billing_address.line_1,
				address_line_2: billing_address.line_2,
				city: billing_address.city,
				state: billing_address.state,
				country: billing_address.country,
				zip_code: billing_address.zip_code,
			},
			{
				where: {
					id: billing_address.id,
				},
			}); 
		}

		if(shipping_address && shipping_address.id) {
			await Address.update({
				address_line_1: shipping_address.line_1,
				address_line_2: shipping_address.line_2,
				city: shipping_address.city,
				state: shipping_address.state,
				country: shipping_address.country,
				zip_code: shipping_address.zip_code,
			},
			{
				where: {
					id: shipping_address.id,
				},
			})	
		}


		await Customer.update(
			{
				name,
				email,
				phone,
				pan_number, 
				customer_type,
				updated_by: req.user.id,
				payment_terms: payment_terms,	
			},
			{
				where: {
					id,
				},
			}
		);
		return res
			.status(200)
			.json(successResponse({ id }, "Customer updated successfully"));
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to update customers", [error], 500));
	}
};

const deleteCustomers = async (req, res) => {
	try {
		const { ids } = req.query;
		await Customer.destroy({
			where: {
				id: {
					[Op.in]: ids,
				},
			},
		});
		res.status(204).json({});
	} catch (error) {
		res
			.status(500)
			.json(errorResponse("Failed to delete customers", [error], 500));
	}	
}


export {
	createCustomers,
	getAllPaymentTerms,
	createPaymentTerms,
	deletePaymentTerms,
	editPaymentTerms,
	getCustomerCount,
	fetchCustomers,
	updateCustomer,
	deleteCustomers
};

async function generateCustomerCode(orgId) {
	// Find the latest customer
	const latestCustomer = await Customer.findOne({
		order: [[Sequelize.col("customer_code"), "DESC"]],
		attributes: ["customer_code"],
		where: {
			organization_id: orgId,
		},
	});

	let nextNumber = 1;

	if (latestCustomer && latestCustomer.customer_code) {
		// Extract numeric part from the latest code
		const matches = latestCustomer.customer_code.match(/-0*(\d+)$/);
		if (matches && matches[1]) {
			nextNumber = parseInt(matches[1], 10) + 1;
		}
	}

	// Pad with leading zeros to maintain 5-digit format
	const paddedNumber = String(nextNumber).padStart(5, "0");
	return `CUST-${paddedNumber}`;
}

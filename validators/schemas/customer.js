import Joi from "joi";

const createCustomer = Joi.object({
	name: Joi.string().required().messages({
		"string.base": "Customer name should be a string.",
		"any.required": "Customer name is required.",
	}),
	phone: Joi.number(),
	email: Joi.string().email().messages({
		"string.base": "Email should be a string.",
		"string.email": "Please provide a valid email address.",
	}),
	pan_card: Joi.string()
		.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
		.messages({
			"string.base": "Pan card should be a string.",
			"string.pattern.base": "Pan card is not valid.",
		}),
	customer_code: Joi.string().min(0).messages({
		"string.base": "Customer code should be a string.",
	}),
	customer_type: Joi.string().valid("1", "2").messages({
		"string.base": "Customer type should be a string.",
		"any.only": "Customer type should be either '1' or '2'.",
	}),
	opening_balance: Joi.number().messages({
		"number.base": "Opening balance should be a number.",
	}),
	tax_number: Joi.string().min(0),
	billing_address: Joi.object({
		line_1: Joi.string().min(0).messages({
			"string.base": "Billing address line 1 should be a string.",
		}),
		line_2: Joi.string().min(0).messages({
			"string.base": "Billing address line 2 should be a string.",
		}),
		city: Joi.string().min(0).messages({
			"string.base": "Billing city should be a string.",
		}),
		state: Joi.string().min(0).messages({
			"string.base": "Billing state should be a string.",
		}),
		country: Joi.string().min(0).messages({
			"string.base": "Billing country should be a string.",
		}),
		zip_code: Joi.string().min(0).messages({
			"string.base": "Billing zip code should be a string.",
		}),
	}),
	shipping_address: Joi.object({
		line_1: Joi.string().min(0).messages({
			"string.base": "Shipping address line 1 should be a string.",
		}),
		line_2: Joi.string().min(0).messages({
			"string.base": "Shipping address line 2 should be a string.",
		}),
		city: Joi.string().min(0).messages({
			"string.base": "Shipping city should be a string.",
		}),
		state: Joi.string().min(0).messages({
			"string.base": "Shipping state should be a string.",
		}),
		country: Joi.string().min(0).messages({
			"string.base": "Shipping country should be a string.",
		}),
		zip_code: Joi.string().min(0).messages({
			"string.base": "Shipping zip code should be a string.",
		}),
	}),
	payment_terms: Joi.number(),
});

export default {
	"/api/v1/customers/create": {
		schema: createCustomer,
		paramType: "body",
		module: "customers",
	},
};

import Joi from "joi";

const createCompany = Joi.object({
	name: Joi.string().required().messages({
		"string.base": "Name should be a string.",
		"any.required": "Name is required.",
	}),
	description: Joi.string().messages({
		"string.base": "Description should be a string.",
	}),
	gst_number: Joi.string()
		.pattern(/^[0-9]{2}[A-Z0-9]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/)
		.required()
		.messages({
			"string.base": "GST Number should be a string.",
			"string.pattern.base": "GST Number is not valid.",
			"any.required": "GST Number is required.",
		}),
});

const getCompanyDetails = Joi.object({
	id: Joi.number(),
});

const validateGst = Joi.object({
	gst_number: Joi.string()
		.pattern(/^[0-9]{2}[A-Z0-9]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/)
		.required()
		.messages({
			"string.base": "GST Number should be a string.",
			"string.pattern.base": "GST Number is not valid.",
			"any.required": "GST Number is required.",
		}),
});

export default {
	"/api/v1/company/create": {
		schema: createCompany,
		paramType: "body",
	},
	"/api/v1/company": {
		schema: getCompanyDetails,
		paramType: "query",
	},
	"/api/v1/company/validate/gst": {
		schema: validateGst,
		paramType: "query",
	},
};

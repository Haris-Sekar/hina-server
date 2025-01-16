import Joi from "joi";

const createUser = Joi.object({
	first_name: Joi.string().required().messages({
		"string.base": "First name should be a string.",
		"any.required": "First name is required.",
	}),

	last_name: Joi.string().messages({
		"string.base": "Last name should be a string.",
	}),

	email: Joi.string().email().required().messages({
		"string.base": "Email should be a string.",
		"string.email": "Please provide a valid email address.",
		"any.required": "Email is required.",
	}),

	password: Joi.string()
		.min(6)
		.max(20)
		.pattern(new RegExp('[!@#$%^&*(),.?":{}|<>]')) // Password should contain at least one special character
		.required()
		.messages({
			"string.base": "Password should be a string.",
			"string.min": "Password should be at least 6 characters long.",
			"string.max": "Password should not exceed 20 characters.",
			"string.pattern.base":
				"Password should contain at least one special character.",
			"any.required": "Password is required.",
		}),

	role_id: Joi.number().messages({
		"number.base": "Role ID should be a number.",
	}),
});

const login = Joi.object({
	email: Joi.string().email().required().messages({
		"string.base": "Email should be a string.",
		"string.email": "Please provide a valid email address.",
		"any.required": "Email is required.",
	}),

	password: Joi.string().required().messages({
		"string.base": "Password should be a string.",
		"any.required": "Password is required.",
	}),
});

const validateJwt = Joi.object({
	token: Joi.string().required().messages({
		"string.base": "Token should be a string.",
		"any.required": "Token is required.",
	}),
});

export default {
	"/api/v1/users/create": {
		schema: createUser,
		paramType: "body",
	},
	"/api/v1/users/login": {
		schema: login,
		paramType: "body",
	},
	"/api/v1/users/validate/jwt": {
		schema: validateJwt,
		paramType: "body",
	},
};

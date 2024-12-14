import validators from "./schemas/index.js";
import { errorResponse } from "../utils/responseFormatter.js";
const validate = async (req, res, next) => {
	try {
		const validator = validators[req._parsedOriginalUrl.pathname];
		await validator.schema.validateAsync(req[validator.paramType], {
			abortEarly: false,
		});
		next();
	} catch (error) {
		const errorMessages = error?.details?.map((err) => err.message);
		res
			.status(403)
			.json(errorResponse("Field validation error", errorMessages, 403));
	}
};

export { validate };

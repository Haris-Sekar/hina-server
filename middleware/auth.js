import passport from "passport";
import { errorResponse } from "../utils/responseFormatter.js";

const authenticateUser = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) {
			return res.status(500).json({
				success: false,
				message: "Authentication error",
				error: err.message,
			});
		}

		if (!user) {
			return res
				.status(401)
				.json(
					errorResponse(
						"Unauthorized access!, You don't have enough permission to perform this action",
						[],
						401
					)
				);
		}

		if (!user.is_verified) {
			return res
				.status(401)
				.json(errorResponse("Please verify your email address", [], 401));
		}

		if (user.status === "INACTIVE") {
			return res
				.status(401)
				.json(errorResponse("User is inactive, please contact admin", [], 401));
		} else if (user.status === "SUSPENDED") {
			return res
				.status(401)
				.json(
					errorResponse("User is suspended, please contact admin", [], 401)
				);
		}

		req.user = user; // Attach user object to request
		next(); // Proceed to the next middleware or route handler
	})(req, res, next);
};

export default authenticateUser;

import { User } from "../models/index.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mail.js";
const createUser = async (req, res) => {
	try {
		const { first_name, last_name, email, password, role_id } = req.body;
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			res.status(409).json(
				errorResponse(
					"User already exists with this email.",
					[
						{
							value: email,
							message: "User already exists with this email.",
						},
					],
					409
				)
			);
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			first_name,
			last_name,
			email,
			password: hashedPassword,
			role_id: null, //portal owner
		});

		const token = jwt.sign(
			{ id: newUser.dataValues.id },
			process.env.JWT_SECRET,
			{
				expiresIn: "6h", // Token expires in 1 hour
			}
		);

		const confirmationUrl = `${process.env.APP_URL}/api/v1/users/confirm/${token}`;
		await sendEmail(
			newUser.email,
			"Confirm Your Email",
			`<h3>Welcome, ${newUser.first_name}!</h3>
       <p>Please confirm your email by clicking the link below:</p>
       <a href="${confirmationUrl}">Confirm Email</a>`
		);

		res
			.status(201)
			.json(
				successResponse(
					newUser.dataValues,
					"User created successfully, confirmation email has been sent"
				)
			);
	} catch (error) {
		res.status(500).json(errorResponse("Internal Server error", [error], 500));
	}
};

const confirmEmail = async (req, res) => {
	const { token } = req.params;

	if (!token) {
		res
			.status(403)
			.json(
				errorResponse("Field validation error", ["Token is required"], 403)
			);
		return;
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findByPk(decoded.id);

		if (!user) {
			return res.status(404).json(errorResponse("User not fount", [], 404));
		}

		await user.update({
			is_verified: true,
			updated_time: Date.now(),
		});

		res.status(200).json(successResponse(user, "Email confirmed successfully"));
	} catch (err) {
		res.status(400).json(errorResponse("Invalid or expired token", [], 400));
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate JWT token
		const payload = { id: user.id, email: user.email };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1d", // Token expiry
		});

		// Respond with the token
		return res.status(200).json({
			success: true,
			message: "Login successful",
			token: `Bearer ${token}`,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		});
	}
};

export { createUser, confirmEmail, login };

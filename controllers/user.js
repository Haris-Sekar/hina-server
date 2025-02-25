import {
    Module,
    Permission,
    Role,
    User
} from "../models/index.js";
import {
    errorResponse,
    successResponse
} from "../utils/responseFormatter.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    sendEmail
} from "../utils/mail.js";
const createUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            role_id
        } = req.body;
        const existingUser = await User.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            res.status(409).json(
                errorResponse(
                    "User already exists with this email.",
                    [{
                        value: email,
                        message: "User already exists with this email.",
                    }],
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

        const token = jwt.sign({
            ...newUser.dataValues
        }, process.env.JWT_SECRET, {
            expiresIn: "6h",
        });

        const confirmationUrl = `${process.env.APP_URL}/user/verify?token=${token}`;
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
    const {
        token
    } = req.params;

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

const acceptInvite = async (req, res) => {
    const {
        token
    } = req.params;

    const {
        password
    } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({
            password: hashedPassword,
            is_verified: true,
            updated_time: Date.now(),
        });

        res.status(200).json(successResponse(user, "Email confirmed successfully"));
    } catch (err) {
        res.status(400).json(errorResponse("Invalid or expired token", [], 400));
    }
};




const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                statusCode: 401,
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                statusCode: 401,
            });
        }

        // Generate JWT token
        const payload = {
            ...user.dataValues
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d", // Token expiry
        });

        // Respond with the token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: `${token}`,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const sendForgetPasswordLink = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const user = await User.findOne({
            where: {
                email
            }
        });

        const token = jwt.sign({
                user,
            },
            process.env.JWT_SECRET, {
                expiresIn: "6h",
            }
        );

        const url = process.env.APP_URL + "/auth/forget";

        await sendEmail(
            newUser.email,
            "Reset your password!",
            `<h3>Hi, ${user.first_name}!</h3>
			<p>Please reset your password using the link below:</p>
			<a href="${url}">Reset your password</a>`
        );

        res
            .status(201)
            .json(
                successResponse(
                    undefined,
                    "A password reset link has been sent to your registered email address. Please check your inbox and follow the instructions to reset your password."
                )
            );
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const validateJWTAndReturnUserObject = async (req, res) => {
    try {
        const {
            token
        } = req.body;
        const obj = jwt.verify(token, process.env.JWT_SECRET);
        const userDetails = await User.findByPk(obj.id);
        if (userDetails) {
            return res.status(200).json(successResponse(obj));
        } else {
            return res.status(401).json(errorResponse("Unauthrozied Access"));
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const {
            password,
            token
        } = req.body;

        const obj = jwt.verify(token, process.env.JWT_SECRET);

        if (obj) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.update({
                password: hashedPassword
            }, {
                where: {
                    id: obj.user.id
                }
            });
            return res
                .status(200)
                .json(successResponse(obj, "Password changed successfully"));
        } else {
            return res.status(400).json(errorResponse("Invalid token", [], 400));
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const inviteUser = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            role_id,
            status
        } = req.body;
        const existingUser = await User.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).json(errorResponse("User already exists", [], 400));
        }


        const user = await User.create({
            first_name,
            last_name,
            email,
            role_id,
            status,
            organization_id: req.org.id,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        const data = {
            ...user.dataValues,
            organization: {
                ...req.org.dataValues
            }
        }


        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });

        const inviteUrl = `${process.env.APP_URL}/user/invite?token=${token}`;
        await sendEmail(email, "Invite", `<h3></h3>Hi, ${user.first_name}!</h3><p>Please confirm your email and join ${req.org.name} by clicking the link below:</p><a href="${inviteUrl}">Accept Invite</a>`)


        res.status(201).json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to invite user", [error], 500));
    }
};


const getAllUsers = async (req, res) => {
    try {

        const {
            page,
            limit,
            sort,
            filter
        } = req.query;

        //select columns other than password
        const attributes = ['id', 'first_name', 'last_name', 'email', 'status', 'is_verified', 'created_by', 'updated_by', 'created_time', 'updated_time', 'role_id'];

        const options = {
            where: {
                organization_id: req.org.id
            },
            attributes,
            include: [{
                model: Role,
                as: "role"
            }, {
                model: User,
                as: "created_by_user"

            }, {
                model: User,
                as: "updated_by_user"
            }],
        };

        if (sort) {
            options.order = [
                [sort, 'ASC']
            ];
        } else {
            options.order = [
                ['created_time', 'ASC']
            ];
        }

        if (limit) {
            options.limit = limit;
        }

        if (page) {
            options.offset = (page - 1) * limit;
        }

        if (filter) {
            options.where = {
                ...options.where,
                ...filter
            };
        }

        const users = await User.findAll(options);
        res.status(200).json(successResponse(users));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get all users", [error], 500));
    }
};

const getUserCount = async (req, res) => {
    try {
        const count = await User.count({
            where: {
                organization_id: req.org.id
            },
        });
        res.status(200).json(successResponse({
            count
        }));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get user count", [error], 500));
    }
};

const getAllRoles = async (req, res) => {
    try {

        const {
            page,
            limit,
            sort,
            filter,
            id
        } = req.query;

        const options = {
            where: {
                organization_id: req.org.id
            },
            include: [{
                model: User,
                as: "created_by_user",
            }, {
                model: User,
                as: "updated_by_user",
            }]
        };

        if (id) {
            options.where.id = id;
        }

        if (sort) {
            options.order = [
                [sort, 'ASC']
            ];
        } else {
            options.order = [
                ['created_time', 'ASC']
            ];
        }

        if (limit) {
            options.limit = limit;
        }

        if (page) {
            options.offset = (page - 1) * limit;
        }

        if (filter) {
            options.where = {
                ...options.where,
                ...filter,
            };
        }
        const roles = await Role.findAll(options);
        res.status(200).json(successResponse(roles));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get all roles", [error], 500));

    }
}

const getRoleCount = async (req, res) => {
    try {
        const count = await Role.count({
            where: {
                organization_id: req.org.id
            },
        });
        res.status(200).json(successResponse({
            count
        }));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get role count", [error], 500));
    }
}


const getRolePermissions = async (req, res) => {
    try {
        const role = await Permission.findAll({
            where: {
                role_id: req.params.id,
                organization_id: req.org.id
            },
            include: [{
                    model: Role,
                    as: "role",
                },
                {
                    model: Module,
                    as: "module",
                },
                {
                    model: User,
                    as: "created_by_user",
                },
                {
                    model: User,
                    as: "updated_by_user",
                }
            ]
        })
        res.status(200).json(successResponse(role));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get role permissions", [error], 500));
    }
}

const getUserPermissions = async (req, res) => {
    try {


        const permissions = await Permission.findAll({
            where: {
                role_id: req.user.role_id,
                organization_id: req.org.id
            },
            include: [{
                    model: Role,
                    as: "role",
                },
                {
                    model: Module,
                    as: "module",
                },
                {
                    model: User,
                    as: "created_by_user",
                },
                {
                    model: User,
                    as: "updated_by_user",
                }
            ]
        })
        res.status(200).json(successResponse(permissions));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to get user permissions", [error], 500));
    }
}

export {
    createUser,
    confirmEmail,
    login,
    sendForgetPasswordLink,
    validateJWTAndReturnUserObject,
    changePassword,
    inviteUser,
    getUserCount,
    getAllUsers,
    getRoleCount,
    getAllRoles,
    acceptInvite,
    getRolePermissions,
    getUserPermissions
};
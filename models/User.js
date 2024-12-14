import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Role from "./Role.js";

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Role,
				key: "id",
			},
		},
		status: {
			type: DataTypes.ENUM,
			values: ["ACTIVE", "INACTIVE", "SUSPENDED", "READ_ONLY"],
			allowNull: false,
			defaultValue: "ACTIVE",
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "users",
				key: "id",
			},
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "users",
				key: "id",
			},
		},
		created_time: {
			type: DataTypes.BIGINT,
			defaultValue: Date.now(),
		},
		updated_time: {
			type: DataTypes.BIGINT,
			defaultValue: Date.now(),
			onUpdate: Date.now(),
		},
	},
	{
		timestamps: false,
		tableName: "users",
	}
);

export default User;

import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export default sequelize.define(
	"Customer",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		customer_code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		customer_type: {
			type: DataTypes.ENUM("1", "2"),
			allowNull: false,
			defaultValue: "1",
		},
		status: {
			type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
			allowNull: false,
			defaultValue: "ACTIVE",
		},
		organization_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
		},
		pan_card: {
			type: DataTypes.STRING,
		},
		billing_address_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "addresses",
				key: "id",
			},
		},
		shipping_address_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "addresses",
				key: "id",
			},
		},
		opening_balance: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0.0, // Default opening balance is 0
			allowNull: false,
		},
		current_balance: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0.0,
			allowNull: false,
		},
		created_time: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: Date.now(),
		},
		updated_time: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: Date.now(),
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
		},
	},
	{
		tableName: "customers",
		timestamps: false,
	}
);

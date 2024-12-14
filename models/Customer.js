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
		display_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
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

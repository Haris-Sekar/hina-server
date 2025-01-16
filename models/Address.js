import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Address = sequelize.define(
	"Address",
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
		address_line_1: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address_line_2: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING,
		},
		country: {
			type: DataTypes.STRING,
		},
		zip_code: {
			type: DataTypes.STRING,
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
			references: {
				model: "users",
				key: "id",
			},
		},
	},
	{
		tableName: "addresses",
		timestamps: false,
	}
);

export default Address;

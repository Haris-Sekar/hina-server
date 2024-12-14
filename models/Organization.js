import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Organization = sequelize.define(
	"Organization",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		gst_number: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		created_time: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: Date.now(),
		},
		updated_time: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: Date.now(),
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
	},
	{
		tableName: "organizations",
		timestamps: false,
	}
);

export default Organization;

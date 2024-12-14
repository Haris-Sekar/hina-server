import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Module = sequelize.define(
	"Module",
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
			unique: true,
		},
		description: {
			type: DataTypes.STRING,
		},
		created_time: {
			type: DataTypes.BIGINT,
			defaultValue: Date.now(),
		},
		updated_time: {
			type: DataTypes.BIGINT,
			defaultValue: Date.now(),
		},
		created_by: {
			type: DataTypes.INTEGER,
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
		timestamps: false,
		tableName: "modules",
	}
);

export default Module;

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Role = sequelize.define(
	"Role",
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
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
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
		tableName: "roles",
		timestamps: false,
	}
);

export default Role;

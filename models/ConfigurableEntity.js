import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ConfigurableEntity = sequelize.define(
	"ConfigurableEntity",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		organization_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "organizations",
				key: "id",
			},
		},
		key: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING(50),
			allowNull: false,
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
		created_time: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_time: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "configurable_entities",
		timestamps: false, 
	}
);

export default ConfigurableEntity;

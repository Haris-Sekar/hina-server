import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Module from "./Module.js";
import Role from "./Role.js";

const Permission = sequelize.define(
	"Permission",
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
		module_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Module,
				key: "id",
			},
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Role,
				key: "id",
			},
		},
		can_read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_create: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_update: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_delete: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_read_all: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_update_all: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		can_delete_all: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
		tableName: "permissions",
		timestamps: false,
	}
);

export default Permission;

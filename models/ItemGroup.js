import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ItemGroup = sequelize.define(
    "ItemGroup",
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
            type: DataTypes.TEXT,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        tableName: "item_groups",
        timestamps: false,
    }
);

export default ItemGroup;
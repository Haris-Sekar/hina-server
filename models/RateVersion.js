import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const RateVersion = sequelize.define(
    "RateVersion",
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
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "items",
                key: "id",
            },
        },
        size_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "sizes",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
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
        tableName: "rate_versions",
        timestamps: false,
    }
);

export default RateVersion;
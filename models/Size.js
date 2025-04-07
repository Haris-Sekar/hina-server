import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Size = sequelize.define(
    "Size",
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
            type: DataTypes.STRING(50),
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
            references: {
                model: "users",
                key: "id",
            },
        },
    },
    {
        tableName: "sizes",
        timestamps: false,
    }
);

export default Size;
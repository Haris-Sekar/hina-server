import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Item = sequelize.define(
    "Item",
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
        item_group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "item_groups",
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
        sku: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        barcode: {
            type: DataTypes.STRING(50),
        },
        has_size: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        unit_of_measure: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        unit_of_bill: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        reorder_point: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
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
        tableName: "items",
        timestamps: false,
    }
);

Item.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
Item.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });

export default Item;
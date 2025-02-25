import {
    sequelize
} from "../config/db.js";
import {
    DataTypes
} from "sequelize";
import Address from "./Address.js";

export default sequelize.define(
    "Customer", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        customer_type: {
            type: DataTypes.ENUM("1", "2"),
            allowNull: false,
            defaultValue: "1",
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            allowNull: false,
            defaultValue: "ACTIVE",
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
        },
        email: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        pan_number: {
            type: DataTypes.STRING,
        },
        tax_number: {
            type: DataTypes.STRING,
        },
        billing_address_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Address",
                key: "id",
            },
        },
        shipping_address_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Address",
                key: "id",
            },
        },
        opening_balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0, // Default opening balance is 0
            allowNull: false,
        },
        current_balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            allowNull: false,
        },
        payment_terms: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "payment_terms",
                key: "id",
            },
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
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
    }, {
        tableName: "customers",
        timestamps: false,
    }
);
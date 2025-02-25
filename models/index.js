import Organization from "./Organization.js";
import Role from "./Role.js";
import User from "./User.js";
import Module from "./Module.js";
import Permission from "./Permission.js";
import PaymentTerms from "./PaymentTerms.js";
import Customer from "./Customer.js";
import Address from "./Address.js";

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
})

User.belongsTo(User, {
    as: "created_by_user",
    foreignKey: "created_by",
})

User.belongsTo(User, {
    as: "updated_by_user",
    foreignKey: "updated_by",
})

Customer.belongsTo(Address, {
    as: "billing_address",
    foreignKey: "billing_address_id",
});
Customer.belongsTo(Address, {
    as: "shipping_address",
    foreignKey: "shipping_address_id",
});

Customer.belongsTo(User, {
    as: "created_by_user",
    foreignKey: "created_by",
});

Customer.belongsTo(User, {
    as: "updated_by_user",
    foreignKey: "updated_by",
});

Role.belongsTo(User, {
    as: "created_by_user",
    foreignKey: "created_by",
})

Role.belongsTo(User, {
    as: "updated_by_user",
    foreignKey: "updated_by",
})

Module.belongsTo(User, {
    as: "created_by_user",
    foreignKey: "created_by",
})

Module.belongsTo(User, {
    as: "updated_by_user",
    foreignKey: "updated_by",
})

Permission.belongsTo(User, {
    as: "created_by_user",
    foreignKey: "created_by",
})

Permission.belongsTo(User, {
    as: "updated_by_user",
    foreignKey: "updated_by",
})

Permission.belongsTo(Role, {
    as: "role",
    foreignKey: "role_id",
});

Permission.belongsTo(Module, {
    as: "module",
    foreignKey: "module_id",
});

export {
    User,
    Organization,
    Role,
    Module,
    Permission,
    PaymentTerms,
    Customer,
    Address,
};
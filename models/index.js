import Organization from "./Organization.js";
import Role from "./Role.js";
import User from "./User.js";
import Module from "./Module.js";
import Permission from "./Permission.js";
import PaymentTerms from "./PaymentTerms.js";
import Customer from "./Customer.js";
import Address from "./Address.js";
import ItemGroup from "./ItemGroup.js";
import Item from "./Item.js";
import Size from "./Size.js";
import RateVersion from "./RateVersion.js";

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

// Item Group associations
ItemGroup.hasMany(Item, { foreignKey: "item_group_id" });
Item.belongsTo(ItemGroup, { foreignKey: "item_group_id" });

// Item associations with Size through RateVersion
Item.belongsToMany(Size, { through: RateVersion });
Size.belongsToMany(Item, { through: RateVersion });

// RateVersion associations
RateVersion.belongsTo(Item, { foreignKey: "item_id" });
RateVersion.belongsTo(Size, { foreignKey: "size_id" });

// Add these associations
ItemGroup.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
ItemGroup.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });

Size.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
Size.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });

RateVersion.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
RateVersion.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });

export {
    User,
    Organization,
    Role,
    Module,
    Permission,
    PaymentTerms,
    Customer,
    Address,
    ItemGroup,
    Item,
    Size,
    RateVersion,
};
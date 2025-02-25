import {
    commitTransaction,
    rollbackTransaction,
    startTransaction
} from "../config/db.js";
import {
    PaymentTerms,
    Module,
    Role,
    Organization
} from "../models/index.js";
import Permission from "../models/Permission.js";

//add new module - Customers

const defaultModules = [{
        name: "Users",
        description: "Manage all employees and team members in your organization."
    },
    {
        name: "Roles",
        description: "Define roles and set permissions for your team members."
    },
    {
        name: "Customers",
        description: "Manage customer details and interactions."
    },
    {
        name: "Dashboard",
        description: "View key insights and reports."
    },
    {
        name: "Invoice",
        description: "Handle invoices and billing efficiently."
    },
    {
        name: "Sales Order",
        description: "Manage sales orders and track transactions."
    },
    {
        name: "Payments",
        description: "Handle incoming and outgoing payments securely."
    },
    {
        name: "Inventory",
        description: "Track and manage your inventory stock."
    },
    {
        name: "Items",
        description: "Organize and categorize products or services."
    },
    {
        name: "Item Group",
        description: "Group similar items for better management."
    },
    {
        name: "Size",
        description: "Define size attributes for items if applicable."
    },
    {
        name: "Rate Version",
        description: "Maintain different price versions for items."
    },
    {
        name: "Vendors",
        description: "Manage supplier details and transactions."
    },
    {
        name: "Bills",
        description: "Track and process vendor bills efficiently."
    },
    {
        name: "Purchase Order",
        description: "Manage and track purchase orders."
    },
    {
        name: "Settings",
        description: "Configure system settings and preferences."
    }
];


const defaultRoles = [{
        name: "Admin",
        description: "Admin role",
    },
    {
        name: "Manager",
        description: "Manager role",
    },
    {
        name: "Employee",
        description: "Employee role",
    },

];

const rolesPermissions = {
    Admin: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE_ALL"],
    Manager: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE"],
    Employee: ["READ_ALL"],
};


const defaultModulePermissions = defaultModules.flatMap(({
        name
    }) =>
    Object.entries(rolesPermissions).map(([roleName, permissions]) => ({
        moduleName: name,
        roleName,
        permissions,
    }))
);

const createDefaultModules = async (userId, orgId, transaction) => {
    const seededModules = [];
    for (const moduleObj of defaultModules) {
        const module = await Module.findOrCreate({
            where: {
                name: moduleObj.name
            },
            defaults: {
                name: moduleObj.name,
                description: moduleObj.description,
                organization_id: orgId,
                created_by: userId,
                updated_by: userId,
            },
            transaction,
        });
        seededModules.push(module[0].dataValues);
    }
    return seededModules;
};

const createDefaultRoles = async (userId, orgId, transaction) => {
    const seededRoles = [];
    for (const roleObj of defaultRoles) {
        const role = await Role.findOrCreate({
            where: {
                name: roleObj.name
            },
            defaults: {
                name: roleObj.name,
                description: roleObj.description,
                organization_id: orgId,
                created_by: userId,
                updated_by: userId,
            },
            transaction,
        });
        seededRoles.push(role[0].dataValues);
    }
    return seededRoles;
};

const createDefaultRolesPermissions = async (
    modules,
    roles,
    userId,
    orgId,
    transaction
) => {
    const seededPermissions = [];
    for (const permissionObj of defaultModulePermissions) {
        const module = modules.find(
            (module) => module.name === permissionObj.moduleName
        );
        const role = roles.find((role) => role.name === permissionObj.roleName);
        const permission = await Permission.findOrCreate({
            where: {
                organization_id: orgId,
                module_id: module.id,
                role_id: role.id,
            },
            defaults: {
                organization_id: orgId,
                module_id: module.id,
                role_id: role.id,
                can_create: permissionObj.permissions.includes("CREATE"),
                can_read_all: permissionObj.permissions.includes("READ_ALL"),
                can_update_all: permissionObj.permissions.includes("UPDATE_ALL"),
                can_delete_all: permissionObj.permissions.includes("DELETE_ALL"),
                can_read: permissionObj.permissions.includes("READ_ALL") ||
                    permissionObj.permissions.includes("READ"),
                can_update: permissionObj.permissions.includes("UPDATE_ALL") ||
                    permissionObj.permissions.includes("UPDATE"),
                can_delete: permissionObj.permissions.includes("DELETE_ALL") ||
                    permissionObj.permissions.includes("DELETE"),
                created_by: userId,
                updated_by: userId,
            },
            transaction,
        });
        seededPermissions.push(permission[0].dataValues);
    }
    return seededPermissions;
};

const seedDefaultPaymentTerms = async (userId, orgId, transaction) => {
    const defaultPaymentTerms = [{
            organization_id: orgId,
            name: "Net 15",
            number_of_days: 15,
            is_default: true,
            created_by: userId,
            updated_by: userId,
        },
        {
            organization_id: orgId,
            name: "Net 30",
            number_of_days: 30,
            is_default: false,
            created_by: userId,
            updated_by: userId,
        },
    ];

    for (const terms of defaultPaymentTerms) {
        await PaymentTerms.findOrCreate({
            where: {
                organization_id: terms.organization_id,
                name: terms.name,
            },
            defaults: terms,
            transaction,
        });
        z
    }
};

const seedValues = async (userId, orgId, transaction) => {
    const seededModules = await createDefaultModules(userId, orgId, transaction);
    const seededRoles = await createDefaultRoles(userId, orgId, transaction);
    const seededPermissions = await createDefaultRolesPermissions(
        seededModules,
        seededRoles,
        userId,
        orgId,
        transaction
    );
    await seedDefaultPaymentTerms(userId, orgId, transaction);
    console.log("values seeded in db successfully for org id ", orgId);
};


const seedDataForAllOrgs = async () => {
    const orgs = await Organization.findAll();
    for (const org of orgs) {
        let transaction = await startTransaction();
        try {
            await seedValues(org.created_by, org.id, transaction);
            await commitTransaction(transaction);
        } catch (error) {
            await rollbackTransaction(transaction);
        }
    }
}


export {
    seedValues,
    seedDataForAllOrgs
};
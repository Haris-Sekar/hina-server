import { ConfigurableEntity, Module, Role } from "../models/index.js";
import Permission from "../models/Permission.js";

const defaultModules = [
	{
		name: "Users",
		description: "Manage your organization people under one roof!!",
	},
	{
		name: "Roles",
		description: "Manage your organization's peoples roles and permission",
	},
];

const defaultRoles = [
	{
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

const defaultModulePermissions = [
	{
		moduleName: "Users",
		roleName: "Admin",
		permissions: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE_ALL"],
	},
	{
		moduleName: "Users",
		roleName: "Manager",
		permissions: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE"],
	},
	{
		moduleName: "Users",
		roleName: "Employee",
		permissions: ["READ_ALL"],
	},
	{
		moduleName: "Roles",
		roleName: "Admin",
		permissions: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE_ALL"],
	},
	{
		moduleName: "Roles",
		roleName: "Manager",
		permissions: ["CREATE", "READ_ALL", "UPDATE_ALL", "DELETE"],
	},
	{
		moduleName: "Roles",
		roleName: "Employee",
		permissions: ["READ_ALL"],
	},
];

const createDefaultModules = async (userId, orgId, transaction) => {
	const seededModules = [];
	for (const moduleObj of defaultModules) {
		const module = await Module.findOrCreate({
			where: { name: moduleObj.name },
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
			where: { name: roleObj.name },
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
				can_read:
					permissionObj.permissions.includes("READ_ALL") ||
					permissionObj.permissions.includes("READ"),
				can_update:
					permissionObj.permissions.includes("UPDATE_ALL") ||
					permissionObj.permissions.includes("UPDATE"),
				can_delete:
					permissionObj.permissions.includes("DELETE_ALL") ||
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

const seedConfigurableEntities = async (userId, orgId) => {
	const defaultEntities = [
		{
			organization_id: orgId,
			key: "net_15",
			value: "15",
			type: "payment_terms",
			created_by: userId,
			updated_by: userId,
		},
		{
			organization_id: orgId,
			key: "net_30",
			value: "30",
			type: "payment_terms",
			created_by: userId,
			updated_by: userId,
		},
	];

	for (const entity of defaultEntities) {
		await ConfigurableEntity.findOrCreate({
			where: {
				organization_id: entity.org_id,
				key: entity.key,
				type: entity.type,
			},
			defaults: entity,
			transaction,
		});
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
	await seedConfigurableEntities(userId, orgId, transaction);
	console.log("values seeded in db successfully");
};

export { seedValues };

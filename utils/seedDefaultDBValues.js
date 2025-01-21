import { User, Module } from "../models/index.js"; 
const defaultModules = [
	{
		name: "Users",
		description: "Manage your organization people under one roof!!",
	},
	{
		name: "Roles",
		description: "Manage your organization's peopes roles and permission",
	},
];

const seedModules = async (userId, orgId) => {
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
		});
		seedModules.push(module[0].dataValues);
	}
	return seededModules;
};

const seedRolesAndPermissions = () => {};

const seed = async (userId, orgId) => {
	const seededModules = await seedModules(userId, orgId);
};

export { seed };

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		logging: false,
	}
);

const testConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Database connection successful!");
	} catch (err) {
		console.error("Unable to connect to the database:", err);
		process.exit(1);
	}
};

const syncDatabase = async () => {
	try {
		if (process.env.SYNC_DB === "true") {
			await sequelize.sync({ alter: true, force: true });
			console.log("Database synchronized");
			return;
		}
	} catch (err) {
		console.error("Error synchronizing database:", err);
	}
};

const startTransaction = async () => {
	const transaction = await sequelize.transaction();
	return transaction;
};

const commitTransaction = async (transaction) => {
	await transaction.commit();
};

const rollbackTransaction = async (transaction) => {
	await transaction.rollback();
};

const queryWithTransaction = async (sql, params, transaction) => {
	const [results] = await sequelize.query(sql, {
		replacements: params,
		transaction,
	});
	return results;
};

export {
	sequelize,
	testConnection,
	syncDatabase,
	startTransaction,
	commitTransaction,
	rollbackTransaction,
	queryWithTransaction,
};

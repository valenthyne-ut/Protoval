import { Sequelize } from "sequelize";
import { logger } from "../../shared/classes/Logger";
import { initModels } from "./models";

export const database = new Sequelize({
	dialect: "sqlite",
	storage: "protoval.sqlite",
	logging: false
});

export async function prepareDatabase(): Promise<Sequelize> {
	const database = new Sequelize({
		dialect: "sqlite",
		storage: "protoval.sqlite",
		logging: false
	});

	logger.info("Preparing database.");
	initModels(database);
	await database.sync();
	logger.info("Database ready.");

	return database;
}

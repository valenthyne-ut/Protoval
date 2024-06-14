import { Sequelize } from "sequelize";

export const database = new Sequelize({
	dialect: "sqlite",
	storage: "protoval.sqlite",
	logging: false
});

import { Sequelize } from "sequelize";
import { OAuthCodeRequest } from "./OAuthCodeRequest";

export function initModels(sequelize: Sequelize) {
	OAuthCodeRequest.initModel(sequelize);
}

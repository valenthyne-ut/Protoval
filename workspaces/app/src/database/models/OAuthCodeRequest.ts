import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class OAuthCodeRequest extends Model<InferAttributes<OAuthCodeRequest>, InferCreationAttributes<OAuthCodeRequest>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare stateNonce: string;
	declare userNonce: string;
	declare expires: number;

	static initModel(sequelize: Sequelize): typeof OAuthCodeRequest {
		return OAuthCodeRequest.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: DataTypes.DATE,
			},
			updatedAt: {
				type: DataTypes.DATE,
			},

			stateNonce: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			userNonce: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			expires: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, { sequelize });
	}
}

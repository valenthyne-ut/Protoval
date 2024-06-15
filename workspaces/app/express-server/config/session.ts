import ConnectSessionSequelize from "connect-session-sequelize";
import { Express } from "express";
import session from "express-session";
import { Sequelize } from "sequelize";
import config from "../../shared/config";

const SequelizeStore = ConnectSessionSequelize(session.Store);

export function setupSessionMiddleware(app: Express, database: Sequelize) {
	app.use(session({
		name: "session",
		secret: config.SERVER_COOKIE_SECRET,
		store: new SequelizeStore({ db: database }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			maxAge: new Date().getTime() + (60 * 60 * 24 * 7 * 1000)
		}
	}));
}

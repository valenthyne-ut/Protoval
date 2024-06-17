import session from "express-session";
import { Express } from "express";
import ConnectSessionSequelize from "connect-session-sequelize";
import { Sequelize } from "sequelize";

const SequelizeStore = ConnectSessionSequelize(session.Store);

export function useSessionMiddleware(app: Express, database: Sequelize, cookieSecret: string) {
	app.use(session({
		name: "session",
		secret: cookieSecret,
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

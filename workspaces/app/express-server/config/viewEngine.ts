import express, { Express } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { renderFile } from "pug";
import { logger } from "../../shared/classes/Logger";

export function setupViewEngine(app: Express) {
	const cwd = process.cwd();
	const htdocsPath = join(cwd, "/htdocs");

	if(existsSync(htdocsPath)) {
		const assetsPath = join(htdocsPath, "/assets");
		const iconPath = join(htdocsPath, "/favicon.ico");

		app.use("/assets", express.static(assetsPath));
		app.use("/favicon.ico", express.static(iconPath));

		app.engine("html", renderFile);
		app.set("view engine", "html");
		app.set("views", htdocsPath);

		app
			.get(["/"], (request, response) => {
				return response.render("index.html");
			})
			.get("*", (request, response) => {
				return response.redirect("/");
			});
	} else {
		logger.warning("Express server is staring in API-only mode.");

		app.get("*", (request, response) => {
			return response.send("<p>This Protoval instance is running in API-only mode.</p>");
		});
	}
}

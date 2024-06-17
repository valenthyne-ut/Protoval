import express, { Express } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { renderFile } from "pug";

export function useViewEngine(app: Express) {
	const cwd = process.cwd();
	const htdocsPath = join(cwd, "/htdocs");

	if(existsSync(htdocsPath)) {
		const assetsPath = join(htdocsPath, "/assets");
		const iconPath = join(htdocsPath, "/favicon.ico");

		app.use("/assets", express.static(assetsPath));
		app.use("/favicon.ico", express.static(iconPath));

		app.engine("html", renderFile);
		app.set("view engine", "html"),
		app.set("views", htdocsPath);

		app
			.get(["/"], (request, response) => {
				return response.render("index.html");
			})
			.get("*", (request, response) => {
				return response.redirect("/");
			});
	} else {
		app.get("*", (request, response) => {
			return response.send("<p>This Protoval instance is running in API-only mode.</p>");
		});
	}
}

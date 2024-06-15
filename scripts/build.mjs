import { appendFileSync, cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import * as init from "./init.mjs";
import { $ as _ } from "execa";

void (async () => {
	if(!init.SKIP_CREDENTIALS && !existsSync(init.APP_CREDENTIALS_DIR)) {
		init.die("SSL credentials not found in app folder. Please provide SSL credentials before proceeding.");
	}

	if(!init.SKIP_ENV_FILE && !existsSync(init.APP_ENV_FILE)) {
		init.die(".env file not found in app folder. Please provide an .env file before proceeding.");
	}

	try {
		const $ = _({ stdio: "inherit" });
		if(existsSync(init.BUILD_ROOT_DIR)) { rmSync(init.BUILD_ROOT_DIR, { recursive: true }); }

		console.log("Building workspaces..");
		await $`yarn workspaces foreach -pA run build`;

		cpSync(init.APP_DIST_DIR, init.BUILD_ROOT_DIR, { recursive: true });

		if(!init.SKIP_CREDENTIALS) { cpSync(init.APP_CREDENTIALS_DIR, init.BUILD_CREDENTIALS_DIR, { recursive: true });	} 
		else { console.log("Skipping SSL credentials."); }

		if(!init.SKIP_ENV_FILE) { 
			cpSync(init.APP_ENV_FILE, init.BUILD_ENV_FILE); 
			appendFileSync(init.BUILD_ENV_FILE, "ENVIRONMENT=production", { encoding: "utf-8" });
		}
		else { console.log("Skipping .env file."); }

		cpSync(init.DASHBOARD_DIST_DIR, init.BUILD_HTDOCS_DIR, { recursive: true });

		console.log("Installing build dependencies.");
		writeFileSync(init.BUILD_YARNLOCK_FILE, "nodeLinker: node-modules", { encoding: "utf-8" });
		
		const buildDependencies = JSON.parse(readFileSync(init.APP_PACKAGE_FILE, { encoding: "utf-8" })).dependencies;
		writeFileSync(init.BUILD_PACKAGE_FILE, JSON.stringify({ dependencies: buildDependencies }, null, 4));

		await $`yarn --cwd ${init.BUILD_ROOT_DIR} install`;
	} catch(error) {
		init.die(error);
	}
})();

import { isAbsolute, join } from "path";

const args = process.argv.slice(2);

/**
 * @param {string} path 
 * @returns {string}
 */
function preparePath(path) {
	if(isAbsolute(path)) { return path; }
	else { return join(process.cwd(), path); }
}

/**
 * @param {string} filter 
 * @returns {string | undefined}
 */
function findArgument(filter) {
	return args.find(value => value.startsWith(`--${filter}=`));
}

/**
 * @param {string} argument 
 * @returns {string | undefined}
 */
function getArgumentValue(argument) {
	return argument.split("=")[1];
}

/**
 * @param {Array<unknown>} data
 * @returns {never}
 */
export function die(...data) {
	console.error(data);
	process.exit(1);
}

const dashboardDirectoryArgument = findArgument("dashboard-directory");
if(typeof dashboardDirectoryArgument === "undefined") { die("dashboard-directory argument not set."); }

const appDirectoryArgument = findArgument("app-directory");
if(typeof appDirectoryArgument === "undefined") { die("app-directory argument not set."); }

const buildDirectoryArgument = findArgument("build-directory");

export const SKIP_CREDENTIALS = findArgument("--skipCredentials") !== undefined;
export const SKIP_ENV_FILE = findArgument("--skipEnv") !== undefined;

export const DASHBOARD_ROOT_DIR = getArgumentValue(dashboardDirectoryArgument);
export const DASHBOARD_DIST_DIR = join(DASHBOARD_ROOT_DIR, "/dist");

export const APP_ROOT_DIR 			= getArgumentValue(appDirectoryArgument);
export const APP_DIST_DIR 			= join(APP_ROOT_DIR, "/dist");
export const APP_CREDENTIALS_DIR 	= join(APP_ROOT_DIR, "/ssl");
export const APP_ENV_FILE 			= join(APP_ROOT_DIR, "/.env");
export const APP_PACKAGE_FILE 		= join(APP_ROOT_DIR, "/package.json");

export const BUILD_ROOT_DIR			= typeof buildDirectoryArgument !== "undefined"?
	getArgumentValue(buildDirectoryArgument) :
	preparePath("build");

export const BUILD_CREDENTIALS_DIR 	= join(BUILD_ROOT_DIR, "/ssl");
export const BUILD_HTDOCS_DIR 		= join(BUILD_ROOT_DIR, "/htdocs");
export const BUILD_YARNLOCK_FILE 	= join(BUILD_ROOT_DIR, "/yarn.lock");
export const BUILD_YARNRC_FILE	 	= join(BUILD_ROOT_DIR, "/yarnrc.yml");
export const BUILD_ENV_FILE 		= join(BUILD_ROOT_DIR, "/.env");
export const BUILD_PACKAGE_FILE 	= join(BUILD_ROOT_DIR, "/package.json");

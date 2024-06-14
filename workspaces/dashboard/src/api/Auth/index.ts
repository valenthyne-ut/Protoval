import { GenericAPI, HTTPMethods } from "..";

export interface GetOAuthLinkResponse {
	url: string;
}

export class AuthAPI extends GenericAPI {
	constructor() {
		super(GenericAPI.DEFAULT_ROOT_PATH + "/auth");
	}

	async getOAuthURL() {
		return await this.call(this.rootPath + "/oauth/link", HTTPMethods.GET) as GetOAuthLinkResponse;
	}

	async getAuthStatus() {
		let authenticated = false;
		
		try {
			await this.call(this.rootPath, HTTPMethods.GET);
			authenticated = true;
		} catch(_) {
			authenticated = false;
		}

		return authenticated;
	}
}

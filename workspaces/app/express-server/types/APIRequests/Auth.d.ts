import { Request } from "express";

export type OAuthUserRequest = Request & {
	cookies: {
		userOAuthNonce: string | undefined;
	},
	query: {
		code: string | undefined;
		state: string | undefined;
	}
}

export type OAuthDiscordAPIResponse = {
	access_token: string;
	token_type: "Bearer";
	expires_in: number;
	refresh_token: string;
	scope: string;
}

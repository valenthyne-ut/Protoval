import { Request } from "express";

export type OAuthAuthenticationRequest = Request & {
	cookies: {
		userOAuthNonce: string | undefined;
	},
	query: {
		code: string | undefined;
		state: string | undefined;
	}
}

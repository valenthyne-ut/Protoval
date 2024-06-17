import { Request } from "express";

export type OAuthUserRequest = Request & {
	cookies: {
		userNonce: string | undefined;
	},
	query: {
		code: string | undefined;
		state: string | undefined;
	}
}

export interface OAuthAuthenticationRequest extends Request<> {
	cookies: {
		userOAuthNonce: string | undefined;
	},
	query: {
		code: string | undefined;
		state: string | undefined;
	}
}

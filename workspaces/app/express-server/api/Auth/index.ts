import { OAuth2Routes, OAuth2Scopes } from "discord.js";
import { Request, RequestHandler, Router } from "express";
import config from "../../../shared/config";
import { URLSearchParams } from "url";
import { randomBytes } from "crypto";

interface OAuthAuthenticationRequestParams { 
	code: string | undefined;
}

type OAuthAuthenticationRequest = Request<unknown, unknown, unknown, OAuthAuthenticationRequestParams>;
type OAuthAuthenticationRequestHandler = RequestHandler<unknown, unknown, unknown, OAuthAuthenticationRequestParams>;

export const authRouter = Router()
	.get("/oauth/code", (async (request: OAuthAuthenticationRequest, response) => {
		const { code } = request.query;
		
		if(code) {
			const oauthResponse = await fetch(OAuth2Routes.tokenURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: new URLSearchParams({
					client_id: config.CLIENT_ID,
					client_secret: config.CLIENT_SECRET,
					grant_type: "authorization_code",
					redirect_uri: "https://localhost:8443/api/auth/oauth/code",
					code: code
				}).toString()
			});

			console.log(await oauthResponse.json());
			return response.redirect("/");
		} else {
			return response.status(401).json({});
		}
	}) as OAuthAuthenticationRequestHandler)
	.get("/oauth/link", (request, response) => {
		const OAuth2URL = new URL("https://discord.com/oauth2/authorize");
		
		OAuth2URL.searchParams.append("response_type", "code");
		OAuth2URL.searchParams.append("client_id", config.CLIENT_ID);
		OAuth2URL.searchParams.append("state", randomBytes(32).toString("hex"));
		OAuth2URL.searchParams.append("scope", config.CLIENT_SCOPES.map(scope => OAuth2Scopes[scope]).join(" "));
		OAuth2URL.searchParams.append("redirect_uri", "https://localhost:8443/api/auth/oauth/code");

		return response.status(200).json({
			url: OAuth2URL.toString()
		});
	});

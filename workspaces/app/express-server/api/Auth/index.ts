import { OAuth2Routes } from "discord.js";
import { Request, RequestHandler, Router } from "express";
import config from "../../../shared/config";
import { URLSearchParams } from "url";

interface OAuthAuthenticationRequestParams { 
	code: string | undefined;
}

type OAuthAuthenticationRequest = Request<unknown, unknown, unknown, OAuthAuthenticationRequestParams>;
type OAuthAuthenticationRequestHandler = RequestHandler<unknown, unknown, unknown, OAuthAuthenticationRequestParams>;

export const authRouter = Router()
	.get("/discord/oauth", (async (request: OAuthAuthenticationRequest, response) => {
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
					redirect_uri: "https://localhost:8443/api/auth/discord/oauth",
					code: code
				}).toString()
			});

			console.log(await oauthResponse.json());
			return response.redirect("/");
		} else {
			return response.status(401).json({});
		}
	}) as OAuthAuthenticationRequestHandler);

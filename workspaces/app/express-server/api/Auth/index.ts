import { randomBytes } from "crypto";
import { OAuth2Routes, OAuth2Scopes } from "discord.js";
import { Router } from "express";
import { URLSearchParams } from "url";
import { logger } from "../../../shared/classes/Logger";
import config from "../../../shared/config";
import { unrollError } from "../../../shared/utility/Errors";
import { OAuthCodeRequest } from "../../database/models/OAuthCodeRequest";
import { OAuthAuthenticationRequest } from "../../types/APIRequests/Auth";

export const authRouter = Router()
	.get("/", (request, response) => {
		if(request.session.authenticated) {
			response.status(200).json({});
		} else {
			response.status(401).json({});
		}
	})
	.get("/code", (request: OAuthAuthenticationRequest, response) => {
		void (async () => {
			const { code, state } = request.query;
			const userCookieNonce = request.cookies.userOAuthNonce;

			if(!code || !state || !userCookieNonce) { return response.status(401).json({}); }

			try {
				const codeRequest = await OAuthCodeRequest.findOne({ 
					where: {
						userCookieNonce: userCookieNonce	
					}
				});

				if(!codeRequest) { return response.status(401).json({}); }
				if(new Date().getTime() > codeRequest.expires) { return response.status(401).json({}); }
				if(codeRequest.userCookieNonce !== userCookieNonce) { return response.status(401).json({}); }
				if(codeRequest.stateNonce !== state) { return response.status(401).json({}); }
			} catch(error) {
				logger.error("An error occurred while identifying a user.\n", unrollError(error, true));
				return response.status(500).json({
					error: "Something went wrong while identifying you. Please, try again."
				});
			}

			try {
				const OAuthResponse = await fetch(OAuth2Routes.tokenURL, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: new URLSearchParams({
						client_id: config.CLIENT_ID,
						client_secret: config.CLIENT_SECRET,
						grant_type: "authorization_code",
						redirect_uri: "https://localhost:8443/api/auth/code",
						code: code
					}).toString()
				});

				if(OAuthResponse.ok) {
					console.log(await OAuthResponse.json());
					request.session.authenticated = true;
					return response
						.clearCookie("userOAuthNonce")
						.redirect("/");
				} else {
					throw new Error(await OAuthResponse.text());
				}
			} catch(error) {
				logger.error("An error occurred while fetching tokens from Discord.\n", unrollError(error, true));
				return response.status(500).json({
					error: "Something went wrong while authorizing you. Please, try again."
				});
			}
		})();
	})
	.get("/link", (request, response) => {		
		void (async () => {
			const stateNonce = randomBytes(32).toString("hex");
			const userCookieNonce = randomBytes(32).toString("hex");
			const expires = new Date().getTime() + (5 * 60 * 1000);

			try {
				await OAuthCodeRequest.create({
					stateNonce: stateNonce,
					userCookieNonce: userCookieNonce,
					expires: expires
				});
			} catch(error) {
				logger.error("An error occurred while saving nonce information to database.\n", unrollError(error, true));
				return response.status(500).json({
					error: "Something went wrong while getting a link for you. Please, try again."
				});
			}

			const OAuth2URL = new URL("https://discord.com/oauth2/authorize");

			OAuth2URL.searchParams.append("response_type", "code");
			OAuth2URL.searchParams.append("client_id", config.CLIENT_ID);
			OAuth2URL.searchParams.append("state", stateNonce);
			OAuth2URL.searchParams.append("scope", config.CLIENT_SCOPES.map(scope => OAuth2Scopes[scope]).join(" "));
			OAuth2URL.searchParams.append("redirect_uri", "https://localhost:8443/api/auth/code");

			response
				.status(200)
				.cookie("userOAuthNonce", userCookieNonce, { 
					expires: new Date(expires),
					httpOnly: true,
					secure: true,
					sameSite: "lax"
				})
				.json({
					url: OAuth2URL
				});
		})();
	});

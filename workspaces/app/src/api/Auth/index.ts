import { randomBytes } from "crypto";
import { Router } from "express";
import { OAuthCodeRequest } from "../../database/models/OAuthCodeRequest";
import { logger } from "..";
import { unrollError } from "../../util/Errors";
import config from "../../config/Env";
import { OAuth2Routes, OAuth2Scopes, RESTPostOAuth2AccessTokenResult } from "discord.js";
import { OAuthUserRequest } from "../../types/AuthAPI";

export const authRouter = Router()
	.get("/", (request, response) => {
		if(request.session.authenticated) {
			response.status(200).json({});
		} else {
			response.status(401).json({});
		}
	})
	.get("/code", (request: OAuthUserRequest, response) => {
		void (async () => {
			const { code, state } = request.query;
			const userNonce = request.cookies.userNonce;

			if(!code || !state || !userNonce) { return response.status(401).json({}); }

			try {
				const codeRequest = await OAuthCodeRequest.findOne({
					where: { userNonce: userNonce }
				});

				if(!codeRequest) { return response.status(401).json({}); }
				if(new Date().getTime() > codeRequest.expires) { return response.status(401).json({}); }
				if(codeRequest.userNonce !== userNonce) { return response.status(401).json({}); }
				if(codeRequest.stateNonce !== state) { return response.status(401).json({}); }
			} catch(error) {
				logger.error(`An error occurred while attempting to identify a user.\n${unrollError(error, true)}`);
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
						redirect_uri: config.CLIENT_REDIRECT_URI,
						code: code
					}).toString()
				});

				if(OAuthResponse.ok) {
					const responseData = await OAuthResponse.json() as RESTPostOAuth2AccessTokenResult;

					request.session.authenticated = true;
					request.session.accessToken = responseData.access_token;
					request.session.refreshToken = responseData.refresh_token;

					return response
						.clearCookie("userNonce", {
							httpOnly: true,
							secure: true,
							sameSite: "lax"
						})
						.redirect(
							config.ENVIRONMENT === "production" ?
								"/" :					
								"http://localhost:5173" // Usually where the Vite server sits
						);
				} else {
					throw new Error(await OAuthResponse.text());
				}
			} catch(error) {
				logger.error(`An error occurred while fetching information from Discord.\n${unrollError(error, true)}`);
				return response.status(500).json({
					error: "Something went wrong while authorizing you. Please, try again."
				});
			}
		})();
	})
	.get("/link", (request, response) => {
		void (async () => {
			const stateNonce = randomBytes(32).toString("hex");
			const userNonce = randomBytes(32).toString("hex");
			const expires = new Date().getTime() + (5 * 60 * 1000);

			try {
				await OAuthCodeRequest.create({
					stateNonce: stateNonce,
					userNonce: userNonce,
					expires: expires
				});
			} catch(error) {
				logger.error(`An error occurred while saving nonce information to database.\n${unrollError(error, true)}`);
				return response.status(500).json({
					error: "Something went wrong while getting an authorization link for you. Please, try again."
				});
			}

			const OAuth2URL = "https://discord.com/oauth2/authorize";
			const params = new URLSearchParams({
				"response_type": "code",
				"client_id": config.CLIENT_ID,
				"state": stateNonce,
				"scope": config.CLIENT_SCOPES.map(scope => OAuth2Scopes[scope]).join(" "),
				"redirect_uri": config.CLIENT_REDIRECT_URI
			});

			response.status(200)
				.cookie("userNonce", userNonce, {
					expires: new Date(expires),
					httpOnly: true,
					secure: true,
					sameSite: "lax"
				})
				.json({
					url: OAuth2URL + "?" + params.toString()
				});
		})();
	});

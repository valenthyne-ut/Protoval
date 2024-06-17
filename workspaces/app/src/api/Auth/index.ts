import { randomBytes } from "crypto";
import { Router } from "express";
import { OAuthCodeRequest } from "../../database/models/OAuthCodeRequest";
import { logger } from "..";
import { unrollError } from "../../util/Errors";
import config from "../../config/Env";
import { OAuth2Scopes } from "discord.js";

export const authRouter = Router()
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

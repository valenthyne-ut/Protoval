import { Router } from "express";
import { authRouter } from "./Auth";
import { Logger } from "../classes/Logger";

export const logger = new Logger("API");

export const apiRouter = Router()
	.use("/auth", authRouter);

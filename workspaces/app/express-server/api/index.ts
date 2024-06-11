import { Router } from "express";
import { authRouter } from "./Auth";

export const apiRouter = Router()
	.use("/auth", authRouter);

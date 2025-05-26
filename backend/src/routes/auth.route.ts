import { Router } from "express";
import { login, signup , me } from "../controllers/auth.controller";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/login", errorHandler(login));   
authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter;
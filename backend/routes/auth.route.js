import express from "express"
import { CurrentUserController, LoginController, LogoutController, RegisterController } from "../controllers/auth.controller.js";
import isAuth from "../middleware/isAuth.js";
const authRouter = express.Router();

authRouter.post("/register", RegisterController)
authRouter.post("/login", LoginController)
authRouter.post("/logout", LogoutController)
authRouter.get("/current-user" , isAuth ,  CurrentUserController);


export default authRouter;

import express from "express"
import ctrl from "../../controllers/authControllers.js"
import { validateBody } from "../../middlewares/validateBody.js"
import { registerSchema, loginSchema } from "../../models/user.js"
import authenticate from "../../middlewares/authenticate.js"

const authRouter = express.Router()

authRouter.post("/register", validateBody(registerSchema), ctrl.register)

authRouter.post("/login", validateBody(loginSchema), ctrl.login)

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

export default authRouter
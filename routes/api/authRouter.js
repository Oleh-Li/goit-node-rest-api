import express from "express"
import ctrl from "../../controllers/authControllers.js"
import { validateBody } from "../../middlewares/validateBody.js"
import { registerSchema, loginSchema } from "../../models/user.js"

const authRouter = express.Router()

authRouter.post("/register", validateBody(registerSchema), ctrl.register)

authRouter.post("/login", validateBody(loginSchema), ctrl.login)

export default authRouter
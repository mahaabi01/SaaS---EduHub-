import express, { Router } from "express"
import AuthController from "../../../controller/globals/auth/auth.controller"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
// import { registerUser } from "../../../controller/globals/auth/auth.controller"
const router:Router = express.Router()

// router.route("/register").post(AuthController.registerUser)
router.route("/register").post(asyncErrorHandler(AuthController.registerUser))
router.route("/login").post(asyncErrorHandler(AuthController.loginUser))

export default router
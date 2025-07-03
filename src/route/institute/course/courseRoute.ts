import express, { Router } from "express"
import Middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from "../../../controller/institute/course/courseController"

const router:Router = express.Router()

router.route("/")
.post(Middleware.isLoggedIn, asyncErrorHandler(createCourse))
.get(asyncErrorHandler(getAllCourse))

router.route("/:id").get(asyncErrorHandler(getSingleCourse))
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCourse))

export default router
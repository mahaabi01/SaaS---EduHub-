import express, { Router } from "express"
import asyncErrorHandler from "../../../../services/asyncErrorHandler"
import Middleware from "../../../../middleware/middleware"
import { Role } from "../../../../middleware/types"
import { createChapterLesson, fetchChapterLesson } from "../../../../controller/teacher/courses/lessons/lesson-controller"

const router:Router = express.Router()

router.route("/:chapterId/lessons").post(Middleware.isLoggedIn, Middleware.restrictTo(Role.Teacher), asyncErrorHandler(createChapterLesson))
.get(Middleware.isLoggedIn, asyncErrorHandler(fetchChapterLesson))

export default router;
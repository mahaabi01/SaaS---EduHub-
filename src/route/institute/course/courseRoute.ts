import express, { Router } from "express"
import Middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from "../../../controller/institute/course/courseController"

import { multer, storage } from './../../../middleware/multerMiddleware'

const upload = multer({storage: storage})

const router:Router = express.Router()


// fieldname is the name of the file which is passed from frontend or postman
router.route("/")
.post(Middleware.isLoggedIn, upload.single('courseThumbnail'), asyncErrorHandler(createCourse))
.get(asyncErrorHandler(getAllCourse))

router.route("/:id").get(asyncErrorHandler(getSingleCourse))
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCourse))

export default router
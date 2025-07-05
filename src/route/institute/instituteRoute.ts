import express, {Router} from "express"
import InstituteController from "../../controller/institute/instituteController"
import Middleware from "../../middleware/middleware"
import asyncErrorHandler from "../../services/asyncErrorHandler"

const router:Router = express.Router()

// router.route("/").post(Middleware.isLoggedIn, InstituteController.createInstitute)
router.route("/addInstitute").post(Middleware.isLoggedIn, InstituteController.createInstitute, InstituteController.createTeacherTable, InstituteController.createStudentTable, InstituteController.createCategoryTable, asyncErrorHandler(InstituteController.createCourseTable))

export default router
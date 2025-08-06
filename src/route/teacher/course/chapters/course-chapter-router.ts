import express, {Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import isLoggedIn from "../../../../middleware/middleware";
import InstituteController from '../../../../controller/institute/instituteController';
import { addChapterToCourse, fetchCourseChapters } from '../../../../controller/teacher/courses/chapters/chapter-controller';
import Middleware from '../../../../middleware/middleware';
import { Role } from '../../../../middleware/types';


const router:Router = express.Router()

// implement restriction code in this code
router.route("/course/:courseId/chapters/").post(Middleware.isLoggedIn, Middleware.restrictTo(Role.Teacher, Role.SuperAdmin), asyncErrorHandler(addChapterToCourse))
.get(Middleware.isLoggedIn, asyncErrorHandler(fetchCourseChapters))

export default router;
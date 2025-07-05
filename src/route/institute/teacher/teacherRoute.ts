import express, { Router } from 'express';
import asyncErrorHandler from '../../../services/asyncErrorHandler';
import Middleware from '../../../middleware/middleware';
import { createTeacher, deleteTeacher, getTeachers } from '../../../controller/institute/teacher/teacherController';
import upload from '../../../middleware/multerUpload';

const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn, upload.single('teacherPhoto') , asyncErrorHandler(createTeacher))
.get(Middleware.isLoggedIn, asyncErrorHandler(getTeachers))
router.route("/:id")
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteTeacher))

export default router
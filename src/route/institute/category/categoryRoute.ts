import express, { Router } from 'express'
import Middleware from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import { createCategory, deleteCategory, getCategories } from '../../../controller/institute/category/categoryController'

const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn, asyncErrorHandler(createCategory))
.get(Middleware.isLoggedIn, asyncErrorHandler(getCategories))
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(deleteCategory))

export default router;
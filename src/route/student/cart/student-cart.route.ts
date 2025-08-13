import express, {Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'

import { fetchStudentCartItems, insertIntoCartTableOfStudent } from '../../../controller/student/cart/student-cart-controller'
import Middleware from '../../../middleware/middleware'
import { UserRole } from '../../../middleware/types'
import User from '../../../database/models/user.model'

const router:Router = express.Router()

router.route("/cart").post(Middleware.isLoggedIn, Middleware.changeUserIdForTableName, Middleware.restrictTo(UserRole.Student), asyncErrorHandler(insertIntoCartTableOfStudent))
.get(Middleware.isLoggedIn, Middleware.changeUserIdForTableName, Middleware.restrictTo(UserRole.Student),asyncErrorHandler(fetchStudentCartItems))

export default router;
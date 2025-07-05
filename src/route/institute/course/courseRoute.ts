import express, { Request, Router } from "express"
import Middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from "../../../controller/institute/course/courseController"

/* local storage
import { multer, storage } from './../../../middleware/multerMiddleware'

const upload = multer({storage: storage})
*/

// online cloudinary storage 
import { cloudinary, storage} from './../../../services/cloudinaryConfig'
import multer from "multer"

const upload = multer({storage: storage ,
  fileFilter : (req:Request, file:Express.Multer.File, cb)=>{
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if(allowedFileTypes.includes(file.mimetype)){
      cb(null,true)
    }else{
      cb(new Error("Only image are supported !"))
    }
  }
})

const router:Router = express.Router()


// fieldname is the name of the file which is passed from frontend or postman
router.route("/")
.post(Middleware.isLoggedIn, upload.single('courseThumbnail'), asyncErrorHandler(createCourse))
.get(asyncErrorHandler(getAllCourse))

router.route("/:id").get(asyncErrorHandler(getSingleCourse))
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCourse))

export default router
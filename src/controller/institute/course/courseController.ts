import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types";

const createCourse = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber
  const {coursePrice, courseName, courseDescription, courseDuration, courseLevel } = req.body;
  if (!coursePrice || !courseName || !courseDescription || !courseDuration || !courseLevel) {
    return res.status(400).json({
      message:
        "Please provide coursePrice, courseName, courseDescription, courseDuration and courseLevel",
    });
  }

  const courseThumbnail = req.file ? req.file.filename : null;
  const returnedData = await sequelize.query(`INSERT INTO course_${instituteNumber}(coursePrice, courseName, courseDescription, courseDuration, courseLevel, courseThumbnail) VALUES (?,?,?,?,?,?)`, {
    replacements: [coursePrice, courseName, courseDescription, courseDuration, courseLevel, courseThumbnail ]
  });

  res.status(200).json({
    message: "Course created successfully."
  })
};

const deleteCourse = async(req:IExtendedRequest, res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber
  const courseId = req.params.id
  //first check if course exist or not, if exist then delete otherwise return
  const [ courseData ] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, {
    replacements : [courseId]
  })

  if(courseData.length == 0){
    return res.status(404).json({
      message: "No course with that id."
    })
  }

  await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id = ?`, {
    replacements: [courseId]
  })
  res.status(200).json({
    message: "Course deleted successfully."
  })
}

const getAllCourse = async (req:IExtendedRequest, res:Response)=> {
  const instituteNumber = req.user?.currentInstituteNumber;
  const courses = await sequelize.query(`SELECT * FROM course_${instituteNumber}`)
  res.status(200).json({
    message: "Course fetched.",
    data: courses
  })
}

const getSingleCourse = async(req:IExtendedRequest, res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber;
  const courseId = req.params.id
  const course = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
    replacements: [courseId]
  })
  res.status(200).json({
    message: "single course fetched.",
    data: course
  })
}

export {createCourse, deleteCourse, getSingleCourse, getAllCourse}
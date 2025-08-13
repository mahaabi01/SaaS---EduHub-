import { Response } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types";
import { QueryTypes } from "sequelize";

const insertIntoCartTableOfStudent = async(req:IExtendedRequest, res:Response)=>{
  const userId = req.user?.id
  const { instituteId, courseId } = req.body
  if(!instituteId || !courseId){
    return res.status(400).json({
      message: "Please provide instituteId."
    })
  }

  await sequelize.query(`CREATE TABLE IF NOT EXISTS student_cart_${userId}(
    id VARCHAR(36) PRIMARY KET DEFAULT (UUID()),
    courseId VARCHAR(36) REFERENCE course_${instituteId}(id) NOT NULL,
    instituteId VARCHAR(36) REFERENCE institute_${instituteId}(id) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    await sequelize.query(`INSERT INTO student_cart_${userId}(courseId, instituteId) VALUES (?,?)`, {
      type: QueryTypes.INSERT,
      replacements: [courseId, instituteId]
    })
    res.status(200).json({
      message: "Course added to cart."
    })

}

const fetchStudentCartItems = async(req:IExtendedRequest,res:Response)=>{
  const userId = req.user?.id
  let cartDatas = []
  const datas : {instituteId : string, courseId : string}[] = await sequelize.query(`SELECT courseId, instituteId FROM student_cart_${userId}`,{
    type: QueryTypes.SELECT
  })
  for(let data of datas){
    const test = await sequelize.query(`SELECT * FROM course_${data.instituteId} WHERE id='${data.courseId}'`, {
      type: QueryTypes.SELECT
    })
    console.log(test)
    cartDatas.push(...test)
  }
  res.status(200).json({
    message: "Cart fetched", data: cartDatas
  })
}

export { insertIntoCartTableOfStudent,fetchStudentCartItems}
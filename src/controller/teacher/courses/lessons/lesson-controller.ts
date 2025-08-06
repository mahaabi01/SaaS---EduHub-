import { Response } from "express";
import { IExtendedRequest } from "../../../../middleware/types";
import sequelize from "../../../../database/connection";
import { QueryTypes } from "sequelize";

const createChapterLesson = async(req:IExtendedRequest, res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber
  const { lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl,chapterId} = req.body
  if(!lessonName || !lessonDescription || !lessonVideoUrl || !lessonThumbnailUrl || !chapterId){
    return res.status(400).json({
      message: "Please provide lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl,chapterId"
    })
  }
  await sequelize.query(`INSERT INTO chapter_lesson_${insitituteNumber}(lessonName,lessonDescription,lessonVideoUrl,lessonThumbnailUrl,chapterId) VALUES(?,?,?,?,?)`, {
    type: QueryTypes.INSERT,
    replacements: [lessonName,lessonDescription, lessonVideoUrl, lessonThumbnailUrl,chapterId]
  })
  res.status(200).json({
    message: "Lesson addded to chapter."
  })
}

const fetchChapterLesson = async(req:IExtendedRequest, res:Response)=>{
  const { chapterId } = req.params
  const instituteNumber = req.user?.currentInstituteNumber
  if(!chapterId) return res.status(400).json({message: "Plase provide chapter ID."})
    const data = await sequelize.query(`SELECt * FROM chapter_lesson_${instituteNumber} WHERE chapterId=?`,{
  type: QueryTypes.SELECT,
replacements: [chapterId]
})
res.status(200).json({
  message: "Lessons fetched.",
  data
})
}

export { fetchChapterLesson, createChapterLesson }
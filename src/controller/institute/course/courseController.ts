import { Request, Response } from "express";
import sequelize from "../../../database/connection";

exports.createCourse = (req: Request, res: Response) => {
  const {
    coursePrice,
    courseName,
    courseDescription,
    courseDuration,
    courseLevel,
  } = req.body;
  if (
    !coursePrice ||
    !courseName ||
    !courseDescription ||
    !courseDuration ||
    !courseLevel
  ) {
    return res.status(400).json({
      message:
        "Please provide coursePrice, courseName, courseDescription, courseDuration and courseLevel",
    });
  }
  sequelize.query(`INSERT INTO course_`);
};

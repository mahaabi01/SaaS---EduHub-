import { NextFunction, Response } from "express";
import sequelize from "../../database/connection";
import { generateRandomInstituteNumber } from "../../services/generateRandomInstituteNumber";
import { IExtendedRequest } from "../../middleware/types";
import User from "../../database/models/user.model";
import categories from "../../storage/seed";
import { QueryTypes } from "sequelize";

class InstituteController {
  static async createInstitute(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        instituteName,
        instituteEmail,
        institutePhoneNumber,
        instituteAddress,
      } = req.body;
      const { institutePanNo } = req.body || null;
      const { instituteVatNo } = req.body || null;
      if (
        !instituteName ||
        !instituteEmail ||
        !institutePhoneNumber ||
        !instituteAddress
      ) {
        res.status(400).json({
          message:
            "Please provide instituteName, instituteEmail, institutePhoneNumber and instituteAddress",
        });
        return;
      }

      const instituteNumber = generateRandomInstituteNumber();

      await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
      id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
      instituteName VARCHAR(255) NOT NULL,
      instituteEmail VARCHAR(255) NOT NULL UNIQUE,
      institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      instituteAddress VARCHAR(255) NOT NULL,
      institutePanNo VARCHAR(255),
      instituteVatNo VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);

      try {
        await sequelize.query(
          `INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES (?,?,?,?,?,?)`,
          {
            replacements: [
              instituteName,
              instituteEmail,
              institutePhoneNumber,
              instituteAddress,
              institutePanNo,
              instituteVatNo,
            ],
          }
        );
      } catch (error) {
        console.log("ERROR OCCURED IN INSERTING:", error);
      }

      // create institute_history table where institute that user have created is stored
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
      id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
      userId VARCHAR(255) REFERENCES users(id),
      instituteNumber INT UNIQUE
      )`);
      if (req.user) {
        await sequelize.query(
          `INSERT INTO user_institute(userId, instituteNumber) VALUES(?,?)`,
          {
            replacements: [req.user.id, instituteNumber],
          }
        );

        await User.update(
          {
            currentInstituteNumber: instituteNumber,
          },
          {
            where: {
              id: req?.user?.id,
            },
          }
        );
      }

      if (req.user) {
        req.user.currentInstituteNumber = instituteNumber;
      }
      /*
      //alternative way
      // if(req.user){
      //   const user = await User.findByPk(req.user.id)
      //   user?.currentInstituteNumber = instituteNumber
      //   await user?.save() // alternative way below
      //   alternative way using raw query can also be used. `UPDATE FROM users SET currentInstituteNumber = instituteNumber WHERE id: id
      // note that for model created it is always better to use ORM method than raw query. 
      //    req.user?.instituteNumber = instituteNumber;
      */

      next();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  static createTeacherTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
        teacherName VARCHAR(255) NOT NULL,
        teacherEmail VARCHAR(255) NOT NULL,
        teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        teacherExpertise VARCHAR(255),
        joinedData DATE,
        salary VARCHAR(100),
        teacherPhoto VARCHAR(255),
        teacherPassword VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
      next();
    } catch (error) {
      console.log("Error Occured :", error);
    }
  };

  static createStudentTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
      studentName VARCHAR(255) NOT NULL,
      studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      studentAddress TEXT,
      enrolledDate DATE,
      studentImage VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      console.log("STUDENT UNDERSCORLD EXECUTED !");
      next();
    } catch (error) {
      console.log("Error Occured:", error);
    }
  };

  static createCategoryTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      categoryName VARCHAR(100) NOT NULL,
      categoryDescription TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    categories.forEach(async function (category) {
      await sequelize.query(
        `INSERT INTO category_${instituteNumber}(categoryName, categoryDescription) VALUES(?,?)`,
        {
          replacements: [category.categoryName, category.categoryDescription],
        }
      );
    });

    next();
  };

  static createCourseChapterTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS course_chapter_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      chapterName VARCHAR(255) NOT NULL,
      chapterDuration VARCHAR(255) NOT NULL,
      chapterDuration VARCHAR(100) NOT NULL,
      chapterLevel ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
      courseId VARCHAR(36) REFERENCES course_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
      createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
    next();
  };

  static createCourseTable = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
      courseName VARCHAR(255) NOT NULL UNIQUE,
      coursePrice VARCHAR(255) NOT NULL,
      courseDuration VARCHAR(100),
      courseLevel ENUM('beginner', 'intermediate', 'advance') NOT NULL,
      courseThumbnail VARCHAR(200),
      courseDescription TEXT,
      teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber} (id),
      categoryId VARCHAR(36) NOT NULL REFERENCES catagory_${instituteNumber} (id),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
    res.status(200).json({
      message: "Institute created successfully.",
      instituteNumber,
    });
  };

  // createChapterLessonTable
  static createChapterLessonTable = async(req:IExtendedRequest, res:Response, next:NextFunction)=>{
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS chapter_lesson_${insitituteNumber}(
      id VARCHAR(36) PRIMARY KET DEFAULT (UUID()),
      lessonName VARCHAR(255) NOT NULL,
      lessonDescription TEXT,
      lessonVideoUrl VARCHAR(200) NOT NULL,
      lessonThumbnailUrl VARCHAR(200) NOT NULL,
      chapterId VARCHAR(36) REFERENCES course_chapter_${insituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,{
        type : QueryTypes.INSERT
      })
      next()
  }
  
  
}

// export default InstituteController;
export default InstituteController;

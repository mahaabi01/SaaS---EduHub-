import { NextFunction, Response } from "express";
import sequelize from "../../database/connection";
import { generateRandomInstituteNumber } from "../../services/generateRandomInstituteNumber";
import { IExtendedRequest } from "../../middleware/types";
import User from "../../database/models/user.model";

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
      const instituteVatNo = req.body.instituteVatNo || null;
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
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      instituteName VARCHAR(255) NOT NULL,
      instituteEmail VARCHAR(255) NOT NULL UNIQUE,
      institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      instituteAddress VARCHAR(255) NOT NULL,
      institutePanNo VARCHAR(255),
      instituteVatNo VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

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

      // if(req.user){
      //   const user = await User.findByPk(req.user.id)
      //   user?.currentInstituteNumber = instituteNumber
      //   await user?.save()

      // create institute_history table where institute that user have created is stored
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
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

        User.update(
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
      req.instituteNumber = instituteNumber;

      //alternative way

      //alternative way using raw query can also be used.

      // req.user?.instituteNumber = instituteNumber;
      next();
      // await sequelize.query(`CREATE TABLE teacher_$`)
    } catch (error) {
      // static async createTeacherTable = async (req:Request, res:Response)=>{
      //   await sequelize.query(` CREATE TABLE teacher_${}`)
      // }

      console.log("Erorr occured:", error);
    }
  }

  static createTeacherTable = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const instituteNumber = req.instituteNumber;
      await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    teacherName VARCHAR(255) NOT NULL,
    teacherEmail VARCHAR(255) NOT NULL,
    teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
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
      const instituteNumber = req.instituteNumber;
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      studentName VARCHAR(255) NOT NULL,
      studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE
    )`);
      next();
    } catch (error) {
      console.log("Error Occured:", error);
    }
  };

  static createCourseTable = async (req: IExtendedRequest, res: Response) => {
    try {
      const instituteNumber = req.instituteNumber;
      await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    courseName VARCHAR(255) NOT NULL UNIQUE,
    coursePrice VARCHAR(255) NOT NULL
    )`);

      res.status(200).json({
        message: "Institute created successfully.",
        instituteNumber,
      });
    } catch (error) {
      console.log("Error Occured:", error);
    }
  };
}

// export default InstituteController;
export default InstituteController;

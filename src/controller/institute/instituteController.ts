import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { generateRandomInstituteNumber } from "../../services/generateRandomInstituteNumber";

class InstituteController{
  static async createInstitute(req: Request, res: Response){
    const {instituteName, instituteEmail, institutePhoneNumber, instituteAddress} = req.body
    const {institutePanNo} = req.body || null
    const instituteVatNo = req.body.instituteVatNo || null
    if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress){
      res.status(400).json({
        message: "Please provide instituteName, instituteEmail, institutePhoneNumber and instituteAddress"
      })
      return
    }

   const instituteNumber = generateRandomInstituteNumber()

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
    )`)

    await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES (?,?,?,?,?,?)`, {
        replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, institutePanNo, instituteVatNo]
      })

    // await sequelize.query(`CREATE TABLE teacher_$`)

    res.status(200).json({
      message: "Institute created successfully."
    })
  }
}

// const createTeacherTable = (req:Request, res:Response) => {
//    sequelize.query(`CREATE TABLE teacher_${institute}`)
// }

export default InstituteController
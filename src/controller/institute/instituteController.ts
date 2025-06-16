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
    const {
      instituteName,
      instituteEmail,
      institutePhoneNumber,
      instituteAddress,
    } = req.body;
    const { institutePanNo } = req.body || null;
    const instituteVatNo = req.body.instituteVatNo || null;
    console.log("Institute Name :", instituteName)
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

    await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${
      instituteNumber
    } (
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

    await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES (?,?,?,?,?,?)`,{
        replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, institutePanNo, instituteVatNo]
      }
    );

    // if(req.user){
    //   const user = await User.findByPk(req.user.id)
    //   user?.currentInstituteNumber = instituteNumber
    //   await user?.save()

    // create institute_history table where institute that user have created is stored

    
      //alternative way
      User.update({
        currentInstituteNumber : instituteNumber
      },{
        where: {
          id: req?.user?.id
        }
      })

      //alternative way using raw query can also be used.

    // req.user?.instituteNumber = instituteNumber;
    next();
    // await sequelize.query(`CREATE TABLE teacher_$`)
  }

  // static async createTeacherTable = async (req:Request, res:Response)=>{
  //   await sequelize.query(` CREATE TABLE teacher_${}`)
  // }
}




// const createTeacherTable = (req:Request, res:Response) => {
//    sequelize.query(`CREATE TABLE teacher_${institute}`)
// }

// export default InstituteController;
export default InstituteController

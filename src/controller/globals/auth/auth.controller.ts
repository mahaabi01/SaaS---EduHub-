// register
// incoming data --> username, email, password
// processing/checking --> email valid, compulsory data
// db-table-query --> like insert/read/modify data
import { Request, Response } from "express";
import User from "../../../database/models/user.model";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

//functional approach
// const registerUser = async (req: Request, res: Response) => {
//   console.log("Request body:", req.body)
//   const { username, password, email } = req.body;
//   if (!username || !password || !email) {
//     res.status(400).json({
//       message: "Please provide username, password, email.",
//     });
//   } else {
//     //insert into Users table
//     await User.create({
//       username,
//       password,
//       email,
//     });
//     res.status(200).json({
//       message: "User registered successfully.",
//     });
//   }
// };

// export { registerUser };

//oop based

class AuthController {
  static async registerUser(req: Request, res: Response) {
    if (req.body == undefined) {
      res.status(400).json({
        message: "No data provided. Please provide email, password and email",
      });
      return;
    }
    const { username, password, email } = req.body;

    console.log(username, password, email + "Username, password, email");
    if (!username || !password || !email) {
      res.status(400).json({
        message: "Please provide username, password, email.",
      });
    } else {
      //insert into Users table
      await User.create({
        username,
        password: bcrypt.hashSync(password, 10),  //bluefish algoeithm
        email,
      });
      res.status(200).json({
        message: "User registered successfully.",
      });
    }
  }

  static async loginUser(req:Request, res: Response){
    //login flow
    // email/username password (basic login system)
    // email/ password accept --> data validation
    // first check email exist or not if yes check password 
    // if user is not registered throw error message as not registered user
    // token generation (jsonwebtoken-jwt)
    const {email, password} = req.body
    if(!email || !password){
      res.status(400).json({
        message: "Please provide email and password."
      })
    }
    //check if email exist or not in our users table
    const data = await User.findAll({
      where: {
        email
      }
    })
    if(data.length == 0){
      res.status(404).json({
        message: "Not registered !!"
      })
    }else{
      //check password validation
      // it takes two arguments that are 1. plain password which is user input and next one is hash password which is password that was inserted into table while registering
      const isPasswordMatch = bcrypt.compareSync(password, data[0].password)
      if(isPasswordMatch){
        // user login and generate token
        const token = jwt.sign({id: data[0].id}, "secretkey",{ 
          expiresIn : "30d"
        })
        // res.cookie("token", token) //save token in cookie
        res.status(200).json({
          token: token,
          message: "Log In successfully."
        })
      }
      else{
        res.status(403).json({
          message: "Invalid email or password."
        })
      }
    }
  }
}

export default AuthController;

// login
// logout
// forgot password
// reset password

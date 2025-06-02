// register
// incoming data --> username, email, password
// processing/checking --> email valid, compulsory data
// db-table-query --> like insert/read/modify data
import { Request, Response } from "express";
import User from "../../../database/models/user.model";

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
    const { username, password, email } = req.body;
    console.log(username, password,email + "Username, password, email")
    if (!username || !password || !email) {
      res.status(400).json({
        message: "Please provide username, password, email.",
      });
    } else {
      //insert into Users table
      await User.create({
        username,
        password,
        email,
      });
      res.status(200).json({
        message: "User registered successfully.",
      });
    }
  }
}

export default AuthController

// login
// logout
// forgot password
// reset password

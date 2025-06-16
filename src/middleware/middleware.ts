import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IExtendedRequest } from "./types";
import User from "../database/models/user.model";

// class Middleware {
//   static async isLoggedIn(
//     req: IExtendedRequest,
//     res: Response,
//     next: NextFunction
//   ) {
//     //check if login or not
//     // token accept and verify
//     const token = req.headers.authorization;
//     if (!token) {
//       res.status(401).json({
//         message: "Please provide token.",
//       });
//       return;
//     }
//     jwt.verify(token, "secretkey", function (error, result: any) {
//       if (error) {
//         res.status(403).json({
//           message: "Invalid token sent.",
//         });
//       } else {
//         // verified
//         const userData = await User.findByPk(result.id);
//         if (!userData) {
//           res.status(403).json({
//             message: "No user with that id, invalid token ",
//           });
//         }else{
//           req.user = userData
//           next()
//         }
//       }
//     });
//   }

//   // static restrictTo(req:Request, res:Response)

//   // })
// }

class Middleware {
  static isLoggedIn = async (
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        message: "please provide token.",
      });
      return;
    }

    jwt.verify(token, "secretkey", async (error: any, result: any) => {
      if (error) {
        res.status(403).json({
          message: "Token invalid provided.",
        });
      } else {
        const userData = await User.findByPk(result.id);
        console.log("User Data: ", userData);
        if (!userData) {
          res.status(403).json({
            message: "No user with that id, invalid token.",
          });
        } else {
          req.user = userData;
          next();
        }
      }
    });
  };
}

export default Middleware;

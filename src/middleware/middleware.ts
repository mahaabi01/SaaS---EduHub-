import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IExtendedRequest } from "./types";
import User from "../database/models/user.model";

class Middleware {
  static isLoggedIn = async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    try{
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
        const userData = await User.findByPk(result.id, {
          attributes: ['id', 'currentInstituteNumber']
        });
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
  
  }
  catch(error){
    console.log("Error:", error)
  }
}

}

export default Middleware;

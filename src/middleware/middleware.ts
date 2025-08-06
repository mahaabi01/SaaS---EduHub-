import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IExtendedRequest, Role } from "./types";
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
          attributes: ['id', 'currentInstituteNumber', 'role']
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

static restrictTo(...roles: Role[]){
  return (req:IExtendedRequest, res: Response, next: NextFunction)=>{
    let userRole = req.user?.role as Role;
    if(!roles.includes(userRole)){
      res.status(403).json({
        message: "You don't have permission",
      })
    }else{
      next();
    }
  }
}



}

export default Middleware;

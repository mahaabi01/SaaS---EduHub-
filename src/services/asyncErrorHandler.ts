import { NextFunction, Request, Response } from "express"

const asyncErrorHandler = (fn:Function) => {
// higher order function is such type of function which accept other function as a paramater
// call back function is such type of function which is passed as parameter/argument to hof
// in this example fn is callback function while asyncErrorHandler is higher order function

  return (req:Request ,res:Response ,next:NextFunction)=>{
    fn(req,res,next).catch((err:Error)=>{
      console.log("Error:", err)
      return res.status(500).json({
        message: res.status(500).json({
          message: err.message,
          fullError: err
        })
      })
    })
  }
}


export default asyncErrorHandler
import { NextFunction,Response,  Request } from "express";
import { HttpExeption } from "../exceptions/root";


export const  errorMiddlware = (error:HttpExeption, req:Request, res:Response, next:NextFunction) => {
   res.status(error.statusCode).json({
       message: error.message,
       errorCode: error.errorCode,
       error: error.errors
   })
}
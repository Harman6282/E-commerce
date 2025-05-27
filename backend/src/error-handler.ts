import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpExeption } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-requests";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpExeption;
      if (error instanceof HttpExeption) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException(
            "Unprocessable entity",
            ErrorCode.UNPROCESSABLE_ENTITY
          );
        } else {
          exception = new InternalException(
            "something went wrong",
            error,
            ErrorCode.INERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};

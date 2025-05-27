import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { prismaClient } from "..";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (user?.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;

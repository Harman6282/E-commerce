import { Request , Response, NextFunction } from "express";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { prismaClient } from "..";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//  1. extract token from header
 const token = req.headers.authorization;
//  2. throw an error if token is not present
if(!token){
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
}

try {
    // 3. if token is present, verify and extract details 
    const payload = jwt.verify(token as string, JWT_SECRET) as any;
    // 4. get the user from the payload 
     const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
     if(!user){
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
     }
    // 5. attach the user to the current request object
     (req as any).user = user
     next();
    
} catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
}
}

export default authMiddleware;
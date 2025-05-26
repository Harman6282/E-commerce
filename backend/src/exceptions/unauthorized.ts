import { HttpExeption } from "./root";


export class UnauthorizedException extends HttpExeption {
    constructor(message: string, errorCode: any) {
        super(message, errorCode, 400, null);
    }
}
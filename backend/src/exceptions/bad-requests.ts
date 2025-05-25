import { HttpExeption } from "./root";


export class BadRequestsException extends HttpExeption {
    constructor(message: string, errorCode: any) {
        super(message, errorCode, 400, null);
    }
}
import { HttpExeption } from "./root";


export class NotfoundException extends HttpExeption {
    constructor(message: string, errorCode: any) {
        super(message, errorCode, 404, null);
    }
}
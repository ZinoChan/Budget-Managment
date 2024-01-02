import { HttpStatusCode } from "@/types/httpStatusCodes";

export class HttpException extends Error {
  public status: HttpStatusCode;
  public message: string;

  constructor(status: HttpStatusCode, message: string) {
    super(`${message}`);
    this.status = status;
    this.message = message;
  }
}

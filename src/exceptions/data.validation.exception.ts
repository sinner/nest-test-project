import { BadRequestException } from "@nestjs/common";

export default class DataValidationException extends BadRequestException {
  constructor(message?: string | object | any, error?: string) {
    super(message, error);
  }
}
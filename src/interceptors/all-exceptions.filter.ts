import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { map } from 'rxjs/operators';
import {classToPlain} from "class-transformer";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from '../config/config.service';
import ErrorResponse from '../dto/error-response.interface';
import * as moment from 'moment';
import TranslatorService from '../translations/translator.service';
import { Validator, ValidationError } from 'class-validator';
import { LoginDto } from './../dto/users/login.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private statusCode: number = 500;
  private message: string = 'error';
  private version: string;
  private appName: string;
  private error?: ErrorResponse;
  private validator: Validator;

  constructor(
      private readonly config: ConfigService,
      private readonly translator: TranslatorService,
  ) {
      this.appName = this.config.get('APP_NAME');
      this.version = this.config.get('APP_VERSION');
      this.validator = new Validator();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: number = this.getExceptionStatus(exception);
    const message = this.getExceptionMessage(exception);

    response
      .send({
        appName: this.appName,
        statusCode: status,
        message: message,
        version: this.version,
        payload: this.getErrorPayload(exception),
        isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
        timestamp: moment().unix(),
        error: {
            type: this.getErrorType(exception),
            path: request.url,
            details: exception,
        },
    });
  }

  getExceptionMessage(exception: any): any {
    let message: any = this.translator.trans('default.error');
    if(exception.message && undefined !== exception.message.error) {
        message = exception.message.error;
    }
    if(exception instanceof TokenExpiredError) {
        message = this.translator.trans('auth.user.expiredAuthToken');
    }
    return message;
  }

  getExceptionStatus (exception: any): number {
    let status = exception.status || this.statusCode;
    if(exception instanceof TokenExpiredError) {
        status = 401;
    }
    return status;
  }

  getErrorType(err: any): string {

    let errorType: string = 'Error';

    // If it is a validation error;
    if (err.response
        && this.validator.isArray(err.response.message)
        && err.response.message.length > 0
        && err.response.message[0] instanceof ValidationError
    ) {
        errorType = 'ValidationError';
    }
    else if (err.response
        && err.response.message
        && err.response.message.username
        && err.response.message.password
        && err instanceof UnauthorizedException
    ) {
        errorType = 'AuthenticationError';
    }

    return errorType;

  }

  getErrorPayload(err: any): any {

      let errorPayload: any = null;

      // If it is a validation error;
      if (err.response
          && this.validator.isArray(err.response.message)
          && err.response.message.length > 0
          && err.response.message[0] instanceof ValidationError
      ) {
          errorPayload = {
              constraints: err.response.message.map((element) => {
                  return {
                      property: element.property,
                      value: element.value,
                      errorMessage: element.constraints[Object.keys(element.constraints)[0]],
                  };
              }),
          };
      }

      return errorPayload;

  }

}

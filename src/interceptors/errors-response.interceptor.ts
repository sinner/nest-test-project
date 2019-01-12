import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from 'src/config/config.service';
import ErrorResponse from 'src/dto/error-response.interface';
import * as moment from 'moment';
import TranslatorService from 'src/translations/translator.service';
import { Validator, ValidationError } from 'class-validator';
import { LoginDto } from './../dto/users/login.dto';

@Injectable()
export class ErrorsResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

    private statusCode: number = 500;
    private message: string = 'error';
    private version: string;
    private payload: T;
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

    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
      ): Observable<StandardResponse<any>> {
        return call$.pipe(
          catchError((err: any, caught: Observable<any>): any => {

            const details: string = (this.config.get('ENVIRONMENT') === 'dev') ? err.stack : null;

            const message = (err.message && undefined !== err.message.error) ? err.message.error : this.translator.trans('default.error');

            const httpStatus: number = err.status || this.statusCode;

            console.log(err);

            return [{
                appName: this.appName,
                statusCode: httpStatus,
                message: message.toString('utf8'),
                version: this.version,
                payload: this.getErrorPayload(err),
                isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
                timestamp: moment().unix(),
                error: {
                    type: this.getErrorType(err),
                    response: err.response.message,
                    details,
                },
            }];

          }),
        );
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

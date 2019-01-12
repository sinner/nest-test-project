import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    HttpStatus,
  } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from 'src/config/config.service';
import ErrorResponse from 'src/dto/error-response.interface';
import * as moment from 'moment';
import { messages } from '../../.history/src/translations/en/login_20190104093215';
import TranslatorService from 'src/translations/translator.service';
import { Validator, ValidationError } from 'class-validator';

@Injectable()
export class ErrorsResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

    private statusCode: number = 500;
    private message: string = 'error';
    private version: string = '0.0.1';
    private payload: T;
    private appName: string;
    private error?: ErrorResponse;
    private validator: Validator;

    constructor(
        private readonly config: ConfigService,
        private readonly translator: TranslatorService,
    ) {
        this.appName = this.config.get('APP_NAME');
        this.validator = new Validator();
    }

    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
      ): Observable<StandardResponse<any>> {
        return call$.pipe(
          catchError((err: any, caught: Observable<any>): any => {

            const details: string = (this.config.get('ENVIRONMENT') === 'dev') ? err.stack : null;

            const message = (undefined !== err.message.error) ? err.message.error : this.translator.trans('default.error');

            return [{
                appName: this.appName,
                statusCode: err.status || this.statusCode,
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
            errorPayload = err.response.message.map((element) => {
                return {
                    property: element.property,
                    value: element.value,
                    errorMessage: element.constraints[Object.keys(element.constraints)[0]],
                };
            });
        }

        return errorPayload;

    }

}

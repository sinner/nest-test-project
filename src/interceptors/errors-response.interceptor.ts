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

@Injectable()
export class ErrorsResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

    private statusCode: number = 500;
    private message: string = 'error';
    private version: string = '0.0.1';
    private payload: T;
    private appName: string;
    private error?: ErrorResponse;

    constructor(private config: ConfigService) {
        this.appName = this.config.get('APP_NAME');
    }

    intercept(
        context: ExecutionContext,
        call$: Observable<any>,
      ): Observable<StandardResponse<any>> {
        return call$.pipe(
          catchError((err: any, caught: Observable<any>): any => {

            const details: string = (this.config.get('ENVIRONMENT') === 'dev') ? err.stack : null;

            return [{
                appName: this.appName,
                statusCode: err.status || this.statusCode,
                message: err.message,
                version: this.version,
                payload: err.response,
                isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
                timestamp: moment().unix(),
                error: {
                    response: err.response,
                    details,
                },
            }];

          }),
        );
    }
}
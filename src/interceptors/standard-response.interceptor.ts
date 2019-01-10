import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from 'src/config/config.service';
import ErrorResponse from 'src/dto/error-response.interface';
import * as moment from 'moment';

@Injectable()
export class StandardResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

  private statusCode: number = 200;
  private message: string = 'success';
  private version: string = '0.0.1';
  private payload: T;
  private appName: string;
  private error?: ErrorResponse;

  constructor(private config: ConfigService) {
      this.appName = this.config.get('APP_NAME');
  }

  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<StandardResponse<T>> {

    return call$.pipe(map((payload: any) => {
      return {
        appName: this.appName,
        statusCode: this.statusCode,
        message: (undefined !== payload.message) ? payload.message : '',
        version: this.version,
        payload,
        isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
        timestamp: moment().unix(),
      };
    }));

  }

}
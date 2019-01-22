import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from 'src/config/config.service';
import ErrorResponse from 'src/dto/error-response.interface';
import * as moment from 'moment';
import {classToPlain} from "class-transformer";

@Injectable()
export class StandardResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

  private statusCode: number = 200;
  private message: string = 'success';
  private version: string;
  private payload: T;
  private appName: string;
  private error?: ErrorResponse;

  constructor(private config: ConfigService) {
      this.appName = this.config.get('APP_NAME');
      this.version = this.config.get('APP_VERSION');
  }

  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<StandardResponse<T>> {

    const request = context.switchToHttp().getRequest();

    return call$.pipe(map((payload: any) => {
      const serializedPayload: any = classToPlain(payload);
      return {
        appName: this.appName,
        statusCode: this.statusCode,
        message: (undefined !== request.statusMessage && undefined !== request.statusMessage) ? request.statusMessage : '',
        version: this.version,
        payload: serializedPayload,
        isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
        timestamp: moment().unix(),
      };
    }));

  }

}
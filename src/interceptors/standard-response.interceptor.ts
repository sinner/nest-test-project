import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
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
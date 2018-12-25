import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import StandardResponse from '../dto/standard-response.interface';
import { ConfigService } from 'src/config/config.service';
import ErrorResponse from 'src/dto/error-response.interface';

@Injectable()
export class StandardResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {

  private statusCode: number = 200;
  private message: string = 'success';
  private version: string;
  private payload: T;
  private appName: string;
  private error?: ErrorResponse;
  private isoDate: string;
  private timestamp: string;

  constructor(private config: ConfigService) {

  }

  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<StandardResponse<T>> {

    return call$.pipe(map(payload => ({
      appName: this.config.get('APP_NAME'),
      statusCode: 200,
      message: '',
      version: '',
      payload,
      isoDate: '',
      timestamp: '',
    })));

  }
}
import * as path from 'path';
import * as glob from 'glob';
import { Injectable, NestMiddleware, MiddlewareFunction, ForbiddenException, HttpException } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import TranslatorService from 'src/translations/translator.service';
import { Http2ServerResponse } from 'http2';
import ErrorResponse from 'src/dto/error-response.interface';
import { Validator } from 'class-validator';
import moment = require('moment');

@Injectable()
export class RequestRequiredHeadersMiddleware implements NestMiddleware {

  private statusCode: number = 500;
  private message: string = 'error';
  private version: string = '0.0.1';
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

  async resolve(...args: any[]): Promise<MiddlewareFunction> {

    return async (req, res, next) => {
      const authorization: string = req.headers.authorization as string;
      if (!authorization && !this.validator.contains(req.originalUrl, '/public')) {
        res.body = {
          appName: this.appName,
          statusCode: 403,
          message: 'The Authorization Token Bearer is a required header parameter',
          version: this.version,
          payload: null,
          isoDate: moment().format('YYYY-MM-DD HH:mm:ssZ'),
          timestamp: moment().unix(),
          error: {
            type: 'ForbiddenError',
            response: 'The Authorization Token Bearer is a required header parameter',
          },
        };
      }
      next();
    };
  }

}
import * as path from 'path';
import * as glob from 'glob';
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RequestLanguageMiddleware implements NestMiddleware {

    protected config: ConfigService;
    protected acceptableLanguages: any;

    constructor(config: ConfigService) {
        this.config = config;
        this.acceptableLanguages = ['es', 'en'];
    }

    getDevice(req) {
        const userAgent: string = req.headers['user-agent'] as string;
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios';
        if (userAgent.includes('Android')) return 'android';
        return 'other';
    }

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            this.config.setRequestHeaders(req.headers);
            next();
        };
    }

}
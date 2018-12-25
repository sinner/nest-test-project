import * as path from 'path';
import * as glob from 'glob';
import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messages as es } from './es';
import {Request} from 'express';
import objectExists from 'src/helpers/object-exists.helper';

@Injectable()
export default class TranslatorService {

    protected defaultMessagesList: any;

    protected static DEFAULT_LANGUAGE: string;

    // Languages for which messages are defined under this dir are acceptable
    protected acceptableLanguages = [];

    protected map: any;

    protected config: ConfigService;

    constructor(config: ConfigService) {

        this.config = config;

        TranslatorService.DEFAULT_LANGUAGE = this.config.get('DEFAULT_LANGUAGE');

        this.acceptableLanguages = glob.sync(`${__dirname}/*.ts`)
            .map((file) => path.basename(file, '.ts'))
            .filter((language) => language !== 'translator.service');

        this.map = this.acceptableLanguages.reduce((acc, language) => {
        acc[language] = require(`./${language}`).messages;
        return acc;
        }, {} as {});

        this.defaultMessagesList = require(`./${TranslatorService.DEFAULT_LANGUAGE || 'en'}`).messages;

    }

    protected getMessages(language: string): any {
        console.log('000: ', this.acceptableLanguages);
        console.log('001: ', this.acceptableLanguages.indexOf(language));
        console.log('002:', language);
        if (this.acceptableLanguages.indexOf(language) >= 0) {
            return this.messagesOf(language);
        } else {
            return this.defaultMessagesList;
        }
    }

    protected getMessagesFromRequest = (): any => {
        let requestedLanguage = TranslatorService.DEFAULT_LANGUAGE;
        if (undefined !== this.config.requestHeaders['accept-language']) {
            requestedLanguage = this.config.requestHeaders['accept-language'];
        }
        const language: string = ( requestedLanguage ) as string;
        return this.getMessages(language);
    }

    /**
     * Returns a messages object for the specified language
     */
    protected messagesOf(language: string): any {
        return this.map[language];
    }

    /**
     * Obtiene un mensaje guardado en el directorio messages basado en el lenguaje del Request o un lenguaje pasado como string.
     *
     * @param messageId string "login.success"
     * @param context string|Request Si es string debe contener el lenguaje es|en
     */
    public trans(messageId: string): string {
        let messages = {};
        let message: any = messageId;

        messages = this.getMessagesFromRequest();

        const messageIds = messageId.split('.');

        if (messageIds && messageIds.length >= 1) {
            message = messages;
            for (const element of messageIds) {
                message = message[element] !== undefined ? message[element] : message;
            }
            if (!message) {
                message = messageId;
            }
        }
        return message;
    }

}

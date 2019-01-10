import * as path from 'path';
import * as glob from 'glob';
import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { messages as es } from './es';
import {Request} from 'express';
import objectExists from 'src/helpers/object-exists.helper';
import replace from 'src/helpers/key-value-replace.helper';

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
     * Getting a translation message.
     *
     * It gets a message stored in the messages directory based on the Request language or a language passed as string.
     * The string message could have variables or parameters, they should be represented by {{ parameterName }}
     * then the "parameters" parameter should contain a json object with the value on this way {parameterName: parameterValue,}
     * the parameterValue should be a value convertible into string
     *
     * @param messageId string "login.success"
     * @param parameter object {parameterName: parameterValue,}
     */
    public trans(messageId: string, parameters?: any): string {
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

        const objectConstructor = {}.constructor;
        if (message !== messageIds && parameters && parameters.constructor === objectConstructor) {
            message = replace(message, parameters);
        }

        return message;
    }

}

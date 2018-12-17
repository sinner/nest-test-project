import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Injectable()
export class AppService {

    constructor(private config: ConfigService) { }

    getDevice(req) {
        const userAgent: string = <string>req.headers['user-agent'];
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios';
        if (userAgent.includes('Android')) return 'Android';
        return 'other';
    }

    getMessages(language: string): any {
        if (ALLOWED_LANGUAGES.indexOf(language) >= 0) {
            return Server.messagesOf(language);
        } else {
            return defaultMessagesList;
        }
    }

      export const getMessagesFromRequest = (req: Request): any => {
        const language = (req.acceptsLanguages(Server.acceptableLanguages) ||
          DEFAULT_LANGUAGE) as string;
        return getMessages(language);
      };

    /**
     * Obtiene un mensaje guardado en el directorio messages basado en el lenguaje del Request o un lenguaje pasado como string.
     *
     * @param messageId string "login.success"
     * @param context string|Request Si es string debe contener el lenguaje es|en
     */
    trans(messageId: string, context?: any): string {

        let messages = {};
        let message: any = messageId;

        if (typeof context === 'string') {
        messages = getMessages(context);
        } else if (typeof context === 'object') {
        messages = getMessagesFromRequest(context);
        }

        const messageIds = messageId.split('.');

        if (messageIds && messageIds.length >= 1) {
        message = messages;
        for (let index = 0; index < messageIds.length; index++) {
            const element = messageIds[index];
            message = message[element] !== undefined ? message[element] : message;
        }
        if (!message) {
            message = messageId;
        }
        }

        return message;
    }

}

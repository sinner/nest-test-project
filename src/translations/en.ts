import {messages as defaultMessage} from './en/default';
import {messages as login} from './en/login';
import {messages as user} from './en/user';
import {messages as userRegister} from './en/user.register';

export const messages = {
    default: defaultMessage,
    login ,
    user: {
        ...user,
        register: userRegister,
    },
};

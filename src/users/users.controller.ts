import { Controller, Get, Post, Put, Delete, Req, Body, ValidationPipe } from '@nestjs/common';
import { UserSignUpDto } from 'src/dto/users/sign-up.dto';
import {getCustomRepository} from "typeorm";
import User from "../entities/user.entity";
import { UserRepository } from "../entities/repositories/user.repository";
import TranslatorService from '../translations/translator.service';
import { ConfigService } from '../config/config.service';
import { config } from 'rxjs';

@Controller('users')
export class UsersController {

    constructor(
        private readonly translator: TranslatorService,
        private readonly conf: ConfigService,
    ) {}

    @Get()
    async getAll() {
        return {
            message: this.translator.trans('default.success'),
            config: this.conf,
        };
    }

    @Post()
    async create(@Body() userData: UserSignUpDto) {

        const userExists = await getCustomRepository(UserRepository).findOne({
            email: userData.email,
        });

        return userExists;
    }

}

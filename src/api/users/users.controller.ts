import { Controller, Get, Post, Put, Delete, Req, Body, ValidationPipe,
    HttpException, HttpStatus, ClassSerializerInterceptor, UseInterceptors, SerializeOptions } from '@nestjs/common';
import {getCustomRepository} from "typeorm";
import { config } from 'rxjs';
import { UserSignUpDto } from 'src/dto/users/sign-up.dto';
import User from "src/entities/user.entity";
import { UserRepository } from "src/entities/repositories/user.repository";
import TranslatorService from 'src/translations/translator.service';
import { ConfigService } from 'src/config/config.service';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import StandardResponse from 'src/dto/standard-response.interface';

@Controller('users')
export class UsersController {

    constructor(
        private readonly translator: TranslatorService,
        private readonly conf: ConfigService,
        private readonly userService: UsersService,
    ) {}

    @Get('/error')
    async getError() {

        throw new HttpException({
            hydi: this.translator.trans('login.invalidCredentials'),
        }, HttpStatus.UNAUTHORIZED);

    }

    @Get()
    async getAll() {

        return await getCustomRepository(UserRepository).find();

    }

    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'user.register.success', type: User })
    @ApiResponse({ status: 400, description: 'user.register.errorData'})
    @Post()
    async create(@Body() userData: UserSignUpDto): Promise<User> {

        const user: User = await this.userService.createUser(userData);

        return user;
    }

}

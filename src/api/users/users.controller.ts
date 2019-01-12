import { Controller, Get, Post, Put, Delete, Req, Body, ValidationPipe,
    HttpException, HttpStatus, ClassSerializerInterceptor, UseInterceptors, SerializeOptions } from '@nestjs/common';
import {getCustomRepository} from "typeorm";
import { config } from 'rxjs';
import { UserSignUpDto } from './../../dto/users/sign-up.dto';
import User from "./../../entities/user.entity";
import { UserRepository } from "./../../entities/repositories/user.repository";
import TranslatorService from './../../translations/translator.service';
import { ConfigService } from './../../config/config.service';
import { UsersService } from './users.service';
import { ApiResponse, ApiUseTags, ApiBearerAuth, ApiImplicitHeader } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import StandardResponse from './../../dto/standard-response.interface';
import { UserSignUpResponse, UserSignUpErrorResponse } from 'src/dto/users/sign-up-response.dto';

@ApiBearerAuth()
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

    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiResponse({ status: 201, description: 'user.register.success', type: UserSignUpResponse })
    @ApiResponse({ status: 400, description: 'user.register.errorData', type: UserSignUpErrorResponse})
    @Post()
    async create(@Body() userData: UserSignUpDto): Promise<User> {

        const user: User = await this.userService.createUser(userData);

        return user;
    }

}

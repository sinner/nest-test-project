import { Controller, Get, Post, Put, Delete, Req, Body, ValidationPipe,
    HttpException, HttpStatus, ClassSerializerInterceptor,
    UseInterceptors, SerializeOptions, UseGuards } from '@nestjs/common';
import {getCustomRepository} from "typeorm";
import { config } from 'rxjs';
import { UserSignUpDto } from './../../dto/users/sign-up.dto';
import User from "./../../entities/user.entity";
import { UserRepository } from "./../../entities/repositories/user.repository";
import TranslatorService from './../../translations/translator.service';
import { ConfigService } from './../../config/config.service';
import { ApplicationService } from './application.service';
import { ApiResponse, ApiUseTags, ApiBearerAuth, ApiImplicitHeader, ApiOperation } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import StandardResponse from './../../dto/standard-response.interface';
import { UserSignUpResponse, UserSignUpErrorResponse } from 'src/dto/users/sign-up-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from './../../api/auth/guards/jwt-auth.guard';
import { JWTTokenResponse } from './../../dto/users/jwt.token.response.dto';
import { CreateApplicationDto } from './../../dto/applications/create.dto';
import Application from './../../entities/application.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('application')
export class ApplicationController {

    constructor(
        private readonly translator: TranslatorService,
        private readonly conf: ConfigService,
        private readonly applicationService: ApplicationService,
    ) {}

    /**
     * Create a new application
     *
     * @param request
     */
    @ApiOperation({ title: `Create a new Application and it will return the
                            API Key and API Key Secret to be able to use this API (application.application.controller::create)` })
    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiImplicitHeader({name: 'Accept-Language', required: false})
    @ApiResponse({ status: 200, description: 'default.success', type: Application })
    @ApiResponse({ status: 401, description: 'user.badAuthToken'})
    @UseGuards(JwtAuthGuard)
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN)
    @Post('/')
    async create(@Req() request: any, @Body() applicationData: CreateApplicationDto): Promise<Application> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        const app: Application = await this.applicationService.createApplication(applicationData);
        return app;
    }

}

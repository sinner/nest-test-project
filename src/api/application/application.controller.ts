import { Controller, Get, Post, Put, Delete, Req, Body, ValidationPipe,
    HttpException, HttpStatus, ClassSerializerInterceptor,
    UseInterceptors, SerializeOptions, UseGuards, Param } from '@nestjs/common';
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

@ApiUseTags('Application')
@ApiBearerAuth()
@Controller('api/v1/applications')
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
    @Post('/')
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN)
    async create(@Req() request: any, @Body() applicationData: CreateApplicationDto): Promise<Application> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        const app: Application = await this.applicationService.createApplication(applicationData, user);
        return app;
    }

    /**
     * Get information of a given application specified by uuid param
     *
     * @param request
     */
    @ApiOperation({ title: `Get information of a given application specified by uuid param and it will return the
                            Application data to be able to use this API (application.application.controller::getInfo)` })
    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiImplicitHeader({name: 'Accept-Language', required: false})
    @ApiResponse({ status: 200, description: 'default.success', type: Application })
    @ApiResponse({ status: 401, description: 'user.badAuthToken'})
    @UseGuards(JwtAuthGuard)
    @Put('/:uuid')
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN, User.ROLE_USER)
    async getInfo(@Req() request: any, @Param() params): Promise<Application> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        const app: Application = await this.applicationService.getApplicationInfo(params.uuid, user);
        return app;
    }

    /**
     * Update a given application specified by uuid param
     *
     * @param request
     */
    @ApiOperation({ title: `Update a given application specified by uuid param and it will return the
                            Application data to be able to use this API (application.application.controller::update)` })
    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiImplicitHeader({name: 'Accept-Language', required: false})
    @ApiResponse({ status: 200, description: 'default.success', type: Application })
    @ApiResponse({ status: 401, description: 'user.badAuthToken'})
    @UseGuards(JwtAuthGuard)
    @Put('/:uuid')
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN, User.ROLE_USER)
    async update(@Req() request: any, @Param() params, @Body() applicationData: CreateApplicationDto): Promise<Application> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        const app: Application = await this.applicationService.updateApplication(applicationData, params.uuid, user);
        return app;
    }

    /**
     * Generate new application's keys
     *
     * @param request
     */
    @ApiOperation({ title: `Generate new application's keys and it will return the
                            API Key and API Key Secret to be able to use this API (application.application.controller::generateNewKeys)` })
    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiImplicitHeader({name: 'Accept-Language', required: false})
    @ApiResponse({ status: 200, description: 'default.success', type: Application })
    @ApiResponse({ status: 401, description: 'user.badAuthToken'})
    @UseGuards(JwtAuthGuard)
    @Put('/:uuid/new-keys')
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN, User.ROLE_USER)
    async generateNewKeys(@Req() request: any, @Param() params): Promise<Application> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        const app: Application = await this.applicationService.generateNewApplicationKeys(params.uuid, user);
        return app;
    }

    /**
     * Remove a given application specified by uuid
     *
     * @param request
     */
    @ApiOperation({ title: `Remove a given application specified by uuid (application.application.controller::remove)` })
    @ApiImplicitHeader({name: 'Authorization', required: true})
    @ApiImplicitHeader({name: 'Accept-Language', required: false})
    @ApiResponse({ status: 200, description: 'default.success', type: Application })
    @ApiResponse({ status: 401, description: 'user.badAuthToken'})
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @Roles(User.ROLE_SUPER_ADMIN, User.ROLE_ADMIN, User.ROLE_USER)
    async remove(@Req() request: any, @Param() params): Promise<boolean> {
        request.statusMessage = this.translator.trans('default.success');
        const user = request.user;
        return await this.applicationService.removeApplication(params.uuid, user);
    }

}

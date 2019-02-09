import { Get, Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppService } from './../../app.service';
import TranslatorService from './../../translations/translator.service';
import { ApiImplicitHeaders, ApiResponse, ApiImplicitHeader, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { LoginDto } from './../../dto/users/login.dto';
import { UserSignUpResponse } from './../../dto/users/sign-up-response.dto';
import { UserSignUpErrorResponse } from './../../dto/users/sign-up-response.dto';
import { validate } from 'class-validator';
import { AuthService } from './../../api/auth/auth.service';
import { UsersService } from './../../api/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from './../../api/auth/guards/jwt-auth.guard';
import { JWTTokenResponse } from './../../dto/users/jwt.token.response.dto';
import StandardResponse from './../../dto/standard-response.interface';
import User from './../../entities/user.entity';

@ApiUseTags('Auth')
@Controller("api/v1/auth")
export class AuthController {

  constructor(
    private readonly translator: TranslatorService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ title: 'Login User (auth.auth.controller::login)' })
  @ApiResponse({ status: 200, description: 'login.successLogin', type:  JWTTokenResponse})
  @ApiResponse({ status: 401, description: 'login.invalidCredentials'})
  @Post('/login')
  async login(@Body() loginData: LoginDto, @Req() request: any): Promise<object> {
    const auth: any = await this.authService.loginUser(loginData);
    request.statusMessage = this.translator.trans('login.successLogin', {
      userName: auth.user.displayName,
    });
    return auth.token;
  }

}
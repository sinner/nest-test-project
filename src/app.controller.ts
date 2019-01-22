import { Get, Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import TranslatorService from './translations/translator.service';
import { ApiImplicitHeaders, ApiResponse, ApiImplicitHeader } from '@nestjs/swagger';
import { LoginDto } from './dto/users/login.dto';
import { UserSignUpResponse } from './dto/users/sign-up-response.dto';
import { UserSignUpErrorResponse } from './dto/users/sign-up-response.dto';
import { validate } from 'class-validator';
import { AuthService } from './api/auth/auth.service';
import { UsersService } from './api/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';
import { JWTTokenResponse } from './dto/users/jwt.token.response.dto';
import StandardResponse from './dto/standard-response.interface';
import User from './entities/user.entity';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly translator: TranslatorService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

}

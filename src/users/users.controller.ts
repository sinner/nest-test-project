import { Controller, Get, Post, Put, Delete, Body, ValidationPipe } from '@nestjs/common';
import { UserSignUpDto } from 'src/dto/users/sign-up.dto';
import {getCustomRepository} from "typeorm";
import User from "../entities/user.entity";
import { UserRepository } from "../entities/repositories/user.repository";

@Controller('users')
export class UsersController {

    @Post()
    async create(@Body() userData: UserSignUpDto) {

        const userExists = await getCustomRepository(UserRepository).findOne({
            email: userData.email,
        });

        return userExists;
    }

}

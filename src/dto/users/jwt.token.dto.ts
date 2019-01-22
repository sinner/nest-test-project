import { IsString, IsInt, MinLength, MaxLength, IsEmail, IsNotEmpty, IsSurrogatePair } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class JWTTokenDto {

    readonly username: string;

    readonly uuid: string;

    readonly email: string;

    readonly roles: string[];

}
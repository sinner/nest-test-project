import { IsString, IsInt, MinLength, MaxLength, IsEmail, IsNotEmpty, IsSurrogatePair } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class JWTTokenResponse {

    readonly expiresIn: any;

    readonly accessToken: string;

}
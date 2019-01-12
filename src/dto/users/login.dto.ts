import { IsString, IsInt, MinLength, MaxLength, IsEmail, IsNotEmpty, IsSurrogatePair } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {

    @ApiModelProperty()
    @IsNotEmpty()
    readonly username: string;

    @ApiModelProperty()
    @IsNotEmpty()
    readonly password: string;

}
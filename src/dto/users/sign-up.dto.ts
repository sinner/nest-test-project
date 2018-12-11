import { IsString, IsInt, MinLength, MaxLength, IsEmail, IsNotEmpty, IsSurrogatePair } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { HasSameValueAs } from '../validators/has-same-value-as.validator';

export class UserSignUpDto {

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(1, {
        message: 'First name is too short',
    })
    @MaxLength(150, {
        message: 'First name is too long',
    })
    readonly firstName: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(1, {
        message: 'Last name is too short',
    })
    @MaxLength(150, {
    message: 'Last name is too long',
    })
    readonly lastName: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(5, {
        message: 'Username is too short',
    })
    @MaxLength(50, {
        message: 'Username is too long',
    })
    readonly username: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(180, {
        message: 'Email is too long',
    })
    readonly email: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(5, {
        message: 'Password is too short',
    })
    readonly plainPassword: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @HasSameValueAs("plainPassword", {
        message: 'Password Confirmation should has the same value as Password',
    })
    @MinLength(5, {
        message: 'Password Confirmation is too short',
    })
    readonly plainPasswordConfirmation: string;

}
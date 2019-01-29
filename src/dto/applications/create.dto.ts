import { IsString, IsInt, IsIn, MinLength, MaxLength, IsEmail, IsNotEmpty, IsSurrogatePair } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { HasSameValueAs } from '../validators/has-same-value-as.validator';

export class CreateApplicationDto {

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(1, {
        message: 'Application name is too short',
    })
    @MaxLength(100, {
        message: 'Application name is too long',
    })
    readonly name: string;

    @ApiModelProperty()
    @MaxLength(300, {
        message: 'Application description is too long',
    })
    readonly description: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsIn(['web', 'ios', 'android', 'desktop', 'windows-mobile'])
    readonly platform: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MaxLength(60, {
        message: 'Application name is too long',
    })
    readonly apiKey: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MaxLength(100, {
        message: 'API Key Secret is too long',
    })
    readonly apiKeySecret: string;

}
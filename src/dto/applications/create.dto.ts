import { IsIn, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

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

}
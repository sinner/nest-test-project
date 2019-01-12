import StandardResponse from 'src/dto/standard-response.interface';
import User from 'src/entities/user.entity';
import ErrorResponse from '../error-response.interface';
import { ApiModelProperty } from '@nestjs/swagger';
import { isArray } from 'util';

export class ValidationErrorDto {

  @ApiModelProperty()
  property: string;

  @ApiModelProperty()
  value: string;

  @ApiModelProperty()
  errorMessage: string;

}

export class BadRequestDto {

  @ApiModelProperty({isArray: true})
  constraints: ValidationErrorDto;

}

export class ErrorResponseDto {

  @ApiModelProperty()
  details?: any;

  @ApiModelProperty()
  response?: any;

  @ApiModelProperty()
  type?: string;

}

export class UserSignUpResponse implements StandardResponse<User> {

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  version: string;

  @ApiModelProperty()
  payload: User;

  @ApiModelProperty()
  appName: string;

  @ApiModelProperty()
  error?: ErrorResponse;

  @ApiModelProperty()
  isoDate: string;

  @ApiModelProperty()
  timestamp: number;

}

export class UserSignUpErrorResponse implements StandardResponse<BadRequestDto> {

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  version: string;

  @ApiModelProperty()
  payload: BadRequestDto;

  @ApiModelProperty()
  appName: string;

  @ApiModelProperty()
  error?: ErrorResponseDto;

  @ApiModelProperty()
  isoDate: string;

  @ApiModelProperty()
  timestamp: number;

}
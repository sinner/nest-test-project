import { JwtService } from '@nestjs/jwt';
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './../../api/users/users.service';
import { ConfigService } from './../../config/config.service';
import TranslatorService from './../../translations/translator.service';

import User from './../../entities/user.entity';

import { LoginDto } from './../../dto/users/login.dto';
import { JWTTokenDto } from './../../dto/users/jwt.token.dto';
import { JWTTokenResponse } from './../../dto/users/jwt.token.response.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly translator: TranslatorService,
  ) {}

  /**
   * This method is used to login users
   *
   * @param loginData LoginDto username and password object
   */
  public async loginUser(loginData: LoginDto): Promise<any> {

    const user = await this.usersService.findByUsernameOrEmail(loginData.username);

    if (!user) {
      throw new UnauthorizedException(loginData, this.translator.trans('login.invalidCredentials'));
    }
    if (!user.isActive) {
      throw new UnauthorizedException(loginData, this.translator.trans('login.inactiveAccount'));
    }
    if (!this.isValidPassword(user, loginData)) {
      throw new UnauthorizedException(loginData, this.translator.trans('login.invalidCredentials'));
    }

    this.setLastLoginDate(user);

    return {
      token: this.createToken(user),
      user,
    };

  }

  /**
   * This method is used by the Passport Strategy to validate the user session info
   * In our case a valid decoded JWT token
   *
   * @param tokenData JWTTokenDto Valid decoded JWT token
   */
  public async validateUser(tokenData: JWTTokenDto): Promise<any> {

    const user = await this.usersService.findByUsernameAndUUID(tokenData.username, tokenData.uuid);

    if (!user.isActive) {
      throw new UnauthorizedException(tokenData, this.translator.trans('login.inactiveAccount'));
    }

    return user;

  }

  private isValidPassword(user: User, loginData: LoginDto): boolean {
    return this.usersService.isValidPassword(user, loginData.password);
  }

  private async setLastLoginDate(user: User): Promise<void> {
    await this.usersService.setLastLoginDate(user);
  }

  private async createToken(user: User): Promise<JWTTokenResponse> {

    const jwtPayload: JWTTokenDto = {
      email: user.email,
      username: user.username,
      uuid: user.uuid,
      roles: user.roles,
    };

    const accessToken: string = this.jwtService.sign(jwtPayload);

    return {
      expiresIn: parseInt(this.config.get('JWT_TTL'), 10),
      accessToken,
    };

  }

}
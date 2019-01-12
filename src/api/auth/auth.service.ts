import { JwtService } from '@nestjs/jwt';
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './../../api/users/users.service';
import { ConfigService } from './../../config/config.service';
import User from './../../entities/user.entity';
import { LoginDto } from './../../dto/users/login.dto';
import TranslatorService from './../../translations/translator.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly translator: TranslatorService,
  ) {}

  async createToken(user: User) {
    const jwtPayload: any = {email: user.email, username: user.username, uuid: user.uuid, roles: user.roles};
    const accessToken = this.jwtService.sign(jwtPayload);
    return {
      expiresIn: this.config.get('JWT_TTL'),
      accessToken,
    };
  }

  async validateUser(loginData: LoginDto): Promise<any> {
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
    return this.createToken(user);
  }

  private isValidPassword(user: User, loginData: LoginDto): boolean {
    return this.usersService.isValidPassword(user, loginData.password);
  }

  public async setLastLoginDate(user: User): Promise<void> {
    await this.usersService.setLastLoginDate(user);
  }

}
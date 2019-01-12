import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '../../config/config.service';
import { JwtPayload } from '../../../.history/src/auth/interfaces/jwt-payload.interface_20190111203651';

@Injectable()
export class AuthService {

  constructor(
    private config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(user: JwtPayload) {
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: this.config.get('JWT_TTL'),
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findOneByEmail(payload.email);
  }

}
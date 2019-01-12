import { Injectable, BadRequestException } from '@nestjs/common';
import User from '../../entities/user.entity';
import { CryptoService } from 'src/config/crypto.service';
import { UserSignUpDto } from 'src/dto/users/sign-up.dto';
import { ConfigService } from 'src/config/config.service';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from 'src/entities/repositories/user.repository';
import { Roles } from 'src/dto/users/roles.dto';
import moment = require('moment');
import { validate } from 'class-validator';
import { TransformClassToPlain } from 'class-transformer';

@Injectable()
export class UsersService {

  constructor(
    private crypto: CryptoService,
    private config: ConfigService,
  ) {}

  @TransformClassToPlain()
  public async createUser(
    userData: UserSignUpDto,
    createdBy?: User,
    confirmEmail: boolean = false,
    roles: string[] = [Roles.ROLE_USER],
  ): Promise<User> {
    const user = new User();
    user.username = userData.username.toLowerCase();
    user.email = userData.email.toLowerCase();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.roles = roles;
    user.displayName = `${user.firstName} ${user.lastName}`;
    user.isActive = true;
    user.createdAt = new Date();
    if (createdBy) {
      user.createdBy = createdBy;
    }
    this.hashPassword(user, userData.plainPassword);
    this.setUUID(user);
    this.generateActivationCode(user);

    const errors = await validate(user);
    if (errors.length > 0) {
        throw new BadRequestException(errors);
    } else {
      await getCustomRepository(UserRepository).save(user);
    }

    return user;
  }

  public setCanonicalizedFields(user: User): User {
    user.setEmailCanonicalized(user.email);
    user.setUsernameCanonicalized(user.username);
    return user;
  }

  public setUUID(user: User): User {
    if (!user.uuid) {
      user.uuid = this.crypto.hash(user.email + user.username);
    }
    return user;
  }

  public generateActivationCode(user: User): User {
    user.activationCode = this.crypto.hash(user.email + user.username + moment().format('YYYY-MM-DD HH:mm:ss Z'));
    return user;
  }

  public hashPassword(user: User, plainPassword: string): User {
    user.salt = this.config.get('APP_SECRET') + this.crypto.generateRandom(64);
    user.password = this.crypto.encrypt(plainPassword, user.salt);
    return user;
  }

}

import { Injectable, BadRequestException } from '@nestjs/common';
import User from '../../entities/user.entity';
import { CryptoService } from './../../helpers/crypto.service';
import { UserSignUpDto } from './../../dto/users/sign-up.dto';
import { ConfigService } from './../../config/config.service';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from './../../entities/repositories/user.repository';
import { Roles } from './../../dto/users/roles.dto';
import moment = require('moment');
import { validate } from 'class-validator';
import { TransformClassToPlain } from 'class-transformer';
import TranslatorService from './../../translations/translator.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly crypto: CryptoService,
    private readonly config: ConfigService,
    private readonly translator: TranslatorService,
  ) { }

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
    user.password = this.getHashedPassword(user, userData.plainPassword);
    this.setUUID(user);
    this.generateActivationCode(user);

    const errors = await validate(user);
    if (errors.length > 0) {
        throw new BadRequestException(errors, this.translator.trans('user.register.errorData'));
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

  public getHashedPassword(user: User, plainPassword: string): string {
    if (!user.salt) {
      user.salt = this.config.get('APP_SECRET') + this.crypto.generateRandom(64);
    }
    return this.crypto.encrypt(plainPassword, user.salt);
  }

  public isValidPassword(user: User, plainPassword: string): boolean {
    return this.crypto.decrypt(user.password, user.salt) === plainPassword;
  }

  public async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    return await getCustomRepository(UserRepository).findByUsernameOrEmail(usernameOrEmail);
  }

  public async findByUsernameAndUUID(username: string, uuid: string): Promise<User | undefined> {
    return await getCustomRepository(UserRepository).findByUsernameAndUUID(username, uuid);
  }

  public async setLastLoginDate(user: User): Promise<void> {
    user.lastLoginAt = new Date();
    await getCustomRepository(UserRepository).save(user);
  }

}

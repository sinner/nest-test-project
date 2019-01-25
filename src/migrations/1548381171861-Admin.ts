import {MigrationInterface, QueryRunner, getCustomRepository} from "typeorm";
import env from '../config/env.util';
import User from '../entities/user.entity';
import { CryptoService } from '../helpers/crypto.service';
import { UserRepository } from '../entities/repositories/user.repository';
import moment = require('moment');

const crypto = new CryptoService();

export class Admin1548381171861 implements MigrationInterface {

  public setCanonicalizedFields(user: User): User {
    user.setEmailCanonicalized(user.email);
    user.setUsernameCanonicalized(user.username);
    return user;
  }

  public setUUID(user: User): User {
    if (!user.uuid) {
      user.uuid = crypto.hash(user.email + user.username);
    }
    return user;
  }

  public generateActivationCode(user: User): User {
    user.activationCode = crypto.hash(user.email + user.username + moment().format('YYYY-MM-DD HH:mm:ss Z'));
    return user;
  }

  public getHashedPassword(user: User, plainPassword: string): string {
    if (!user.salt) {
      user.salt = crypto.getSecret() + crypto.generateRandom(64);
    }
    return crypto.encrypt(plainPassword, user.salt);
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    user.email = env.APP_ADMIN_EMAIL || 'admin@mail.com';
    user.username = 'admin';
    user.firstName = 'Administrator';
    user.lastName = 'User';
    user.roles = ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];
    user.displayName = `${user.firstName} ${user.lastName}`;
    user.isActive = true;
    user.createdAt = new Date();
    user.password = this.getHashedPassword(user, env.APP_ADMIN_PASSWORD || 'admin');
    this.setUUID(user);
    this.generateActivationCode(user);
    await getCustomRepository(UserRepository).save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "user" WHERE username = 'admin'`);
  }

}

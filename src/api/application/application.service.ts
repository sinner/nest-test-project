import { Injectable, BadRequestException } from '@nestjs/common';
import User from '../../entities/user.entity';
import { CryptoService } from './../../helpers/crypto.service';
import { CreateApplicationDto } from './../../dto/applications/create.dto';
import { ConfigService } from './../../config/config.service';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from './../../entities/repositories/user.repository';
import moment = require('moment');
import { validate } from 'class-validator';
import { TransformClassToPlain } from 'class-transformer';
import TranslatorService from './../../translations/translator.service';
import Application from '../../entities/application.entity';
import { ApplicationRepository } from '../../entities/repositories/application.repository';

@Injectable()
export class ApplicationService {

  constructor(
    private readonly crypto: CryptoService,
    private readonly config: ConfigService,
    private readonly translator: TranslatorService,
  ) { }

  @TransformClassToPlain()
  public async createApplication(
    appData: CreateApplicationDto,
    createdBy?: User,
  ): Promise<Application> {

    let application = await this.findByUserAndAppPlatform(createdBy, appData.platform);

    if (application) {
      throw new BadRequestException(application, this.translator.trans('application.limit.perPlatform.exceeded'));
    }

    application = new Application();
    application.name = appData.name;
    application.description = appData.description;
    application.platform = appData.platform;
    application.createdBy = createdBy;
    application.isActive = true;
    application.createdAt = new Date();
    application.apiKey = this.generateApiKey(application);
    application.apiKeySecret = this.generateApiKeySecret(application);
    this.setUUID(application);

    const errors = await validate(application);
    if (errors.length > 0) {
        throw new BadRequestException(errors, this.translator.trans('application.create.errorData'));
    } else {
      await getCustomRepository(ApplicationRepository).save(application);
    }

    return application;
  }

  public async findByUserAndAppPlatform(user: User, platform: string): Promise<Application> {
    const application: Application = await getCustomRepository(ApplicationRepository).findByUserAndAppPlatform(user, platform);
    return application;
  }

  public generateApiKey(app: Application): string {
    const apiKey: string = this.crypto.hash(app.name + app.createdBy.username + app.platform + moment().format('YYYY-MM-DD HH:mm:ss Z'));
    return apiKey.substring(0, 60);
  }

  public generateApiKeySecret(app: Application): string {
    const apiKeySecret: string = this.crypto.hash(app.apiKey) + this.crypto.hash(moment().format('YYYY-MM-DD HH:mm:ss Z'));
    return apiKeySecret.substring(0, 100);
  }

  public setUUID(app: Application): Application {
    if (!app.uuid) {
      app.uuid = this.crypto.hash(app.name + app.createdBy.username + app.platform);
    }
    return app;
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

import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
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
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationService {

  constructor(
    private readonly crypto: CryptoService,
    private readonly config: ConfigService,
    private readonly translator: TranslatorService,
    private readonly usersService: UsersService,
  ) { }

  @TransformClassToPlain()
  public async getApplicationInfo(
    uuid: string,
    user?: User,
  ): Promise<Application> {
    
    const application = await this.findByUUID(uuid);

    this.userHasRequiredPermission(user, application);

    return application;

  }  

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
    application.isActive = true;
    application.createdBy = createdBy;
    application.createdAt = new Date();
    application.apiKey = this.generateApiKey(application);
    application.apiKeySecret = this.generateApiKeySecret(application);

    if (appData.ownerUuid && this.userHasAdminPermission(createdBy)) {
      const ownerUser = await this.usersService.findByUUID(appData.ownerUuid);
      if (ownerUser) {
        application.owner = ownerUser;
      }
    }
    else {
      application.owner = createdBy;
    }

    this.setUUID(application);

    const errors = await validate(application);
    if (errors.length > 0) {
        throw new BadRequestException(errors, this.translator.trans('application.create.errorData'));
    } else {
      await getCustomRepository(ApplicationRepository).save(application);
    }

    return application;
  }

  @TransformClassToPlain()
  public async updateApplication(
    appData: CreateApplicationDto,
    uuid: string,
    updatedBy?: User,
  ): Promise<Application> {

    const application = await this.findByUUID(uuid);

    this.userHasRequiredPermission(updatedBy, application);

    let applicationToValidate = await this.findByUserAndAppPlatform(updatedBy, appData.platform);

    if (applicationToValidate && applicationToValidate.getId() != application.getId()) {
      throw new BadRequestException(application, this.translator.trans('application.limit.perPlatform.exceeded'));
    }

    application.name = appData.name;
    application.description = appData.description;
    application.platform = appData.platform;
    application.updatedBy = updatedBy;
    
    const errors = await validate(application);
    if (errors.length > 0) {
        throw new BadRequestException(errors, this.translator.trans('application.create.errorData'));
    } else {
      await getCustomRepository(ApplicationRepository).save(application);
    }

    return application;

  }

  @TransformClassToPlain()
  public async generateNewApplicationKeys(
    uuid: string,
    updatedBy?: User,
  ): Promise<Application> {
    
    const application = await this.findByUUID(uuid);

    this.userHasRequiredPermission(updatedBy, application);

    application.apiKey = this.generateApiKey(application);
    application.apiKeySecret = this.generateApiKeySecret(application);
    application.updatedBy = updatedBy;

    await getCustomRepository(ApplicationRepository).save(application);

    return application;

  }

  @TransformClassToPlain()
  public async removeApplication(
    uuid: string,
    user?: User,
  ): Promise<boolean> {
    
    const application = await this.findByUUID(uuid);

    this.userHasRequiredPermission(user, application);

    await getCustomRepository(ApplicationRepository).remove(application);

    return true;

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

  public async userHasRequiredPermission(user: User, application: Application): Promise<boolean> {
    if (!user.hasRole(User.ROLE_SUPER_ADMIN) && !user.hasRole(User.ROLE_ADMIN) && application.owner.getId() !== user.getId()) {
      throw new ForbiddenException(null, this.translator.trans('default.forbidden'));
    }
    return true;
  }

  public async findByUUID(uuid: string): Promise<Application | undefined> {
    const application = await getCustomRepository(ApplicationRepository).findOne({ uuid });
    if (!application) {
      throw new NotFoundException(application, this.translator.trans('application.notFound'));
    }
    return application;
  }

  public async setLastLoginDate(user: User): Promise<void> {
    user.lastLoginAt = new Date();
    await getCustomRepository(UserRepository).save(user);
  }

  public userHasAdminPermission(user: User): boolean {
    if (!user.hasRole(User.ROLE_SUPER_ADMIN) && !user.hasRole(User.ROLE_ADMIN)) {
      return false;
    }
    return true;
  }

}

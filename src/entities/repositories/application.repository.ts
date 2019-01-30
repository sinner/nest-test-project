import {EntityRepository, Repository} from 'typeorm';
import { Validator } from 'class-validator';
import Application from './../application.entity';
import User from '../user.entity';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {

    protected validator: Validator;

    constructor() {
        super();
        this.validator = new Validator();
    }

    public async findByApiKeys(apiKey: string, apiKeySecret: string): Promise<Application | undefined> {
        return await this.findOne({ apiKey, apiKeySecret });
    }

    public async findByUserAndAppPlatform(user: User, platform: string): Promise<Application | undefined> {
        return await this.findOne({
            createdBy: user,
            platform,
        });
    }

}

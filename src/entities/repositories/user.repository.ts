import {EntityRepository, Repository} from 'typeorm';
import { Validator } from 'class-validator';
import User from 'src/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    protected validator: Validator;

    constructor() {
        super();
        this.validator = new Validator();
    }

    public async findByUsername(username: string): Promise<User | undefined> {
        return await this.findOne({ username });
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return await this.findOne({ email });
    }

    public async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
        if (!this.validator.isEmail(usernameOrEmail)) {
            const user = await this.findByUsername(usernameOrEmail);
            if (user) {
                return user;
            }
        }
        return await this.findByEmail(usernameOrEmail);
    }

    public async findByActivationCode(activationCode: string): Promise<User | undefined> {
        return await this.findOne({ activationCode });
    }

}

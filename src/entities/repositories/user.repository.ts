import {EntityRepository, Repository} from 'typeorm';
import User from '../user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findByName(firstName: string, lastName: string) {
        return this.findOne({ firstName, lastName });
    }

}

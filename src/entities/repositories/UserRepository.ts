import {EntityRepository, Repository} from 'typeorm';
import User from '../User';

@EntityRepository(User)
export class AuthorRepository extends Repository<User> {

    findByName(firstName: string, lastName: string) {
        return this.findOne({ firstName, lastName });
    }

}

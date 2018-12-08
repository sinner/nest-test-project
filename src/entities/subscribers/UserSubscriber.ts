import {EventSubscriber, EntitySubscriberInterface} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<any> {

}

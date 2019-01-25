import {EventSubscriber, EntitySubscriberInterface} from 'typeorm';

@EventSubscriber()
export class ApplicationSubscriber implements EntitySubscriberInterface<any> {

}

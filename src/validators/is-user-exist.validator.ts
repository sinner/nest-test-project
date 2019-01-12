import {registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import { getCustomRepository, getRepository } from "typeorm";
import { UserRepository } from 'src/entities/repositories/user.repository';
import User from "src/entities/user.entity";

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

    async validate(value: any, args: ValidationArguments) {
      const relatedPropertyName = args.property;
      const user = await getRepository(User).findOne(
        { [relatedPropertyName]: value },
      );
      if (user) {
        return false;
      }
      return true;
    }

}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
       registerDecorator({
           target: object.constructor,
           propertyName,
           options: validationOptions,
           constraints: [],
           validator: IsUserAlreadyExistConstraint,
       });
  };
}

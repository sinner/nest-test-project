import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";

export function HasSameValueAs(property: string, validationOptions?: ValidationOptions) {
   return (object, propertyName: string) => {
        registerDecorator({
            name: "hasSameValueAs",
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  typeof value === "string" &&
                           typeof relatedValue === "string" &&
                           value === relatedValue;
                },
            },
        });
   };
}
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('Context Required Roles: ', requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User: ', user);
    console.log('Request: ', request);

    if (!user) {
      return false;
    }

    console.log('User Roles: ', user.roles);

    const hasRole = () => user.roles.some((role: string) => requiredRoles.includes(role));
    return user && user.roles && hasRole();
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import TranslatorService from './../../../translations/translator.service';
import { ConfigService } from './../../../config/config.service';
import User from '../../../entities/user.entity';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../../entities/repositories/user.repository';
import * as _ from "lodash";

@Injectable()
export class RolesGuard implements CanActivate {

  private roleHierarchy: any;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly translator: TranslatorService,
  ) {
    this.roleHierarchy = [
      {
        role: User.ROLE_SUPER_ADMIN,
        includedRoles: [User.ROLE_USER, User.ROLE_ADMIN, User.ROLE_APPLICATION],
      },
      {
        role: User.ROLE_ADMIN,
        includedRoles: [User.ROLE_USER, User.ROLE_APPLICATION],
      },
      {
        role: User.ROLE_APPLICATION,
        includedRoles: [User.ROLE_USER],
      },
    ];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if(!requiredRoles) {
      return true;
    }

    if (request.headers.authorization && request.headers.authorization.toString().split(' ')[0] === 'Bearer') {
        const token: string = request.headers.authorization.toString().split(' ')[1];
        const decoded = this.jwtService.verify(token, this.config.get('JWT_SECRET_KEY'));
        const user: User = await getCustomRepository(UserRepository).findOne({
          uuid: decoded.uuid,
        });
        const requiredRolesHierarchy = _.uniq(this.getRoleHierarchy(requiredRoles));
        const hasRole = () => user.roles.some((role: string) => requiredRoles.includes(role));
        const hasRoleHierarchy = () => user.roles.some((role: string) => requiredRolesHierarchy.includes(role));
        return user && user.roles && (hasRole() || hasRoleHierarchy());
    } else {
        return false;
    }
  }

  getRoleHierarchy(requiredRoles: string[]): string[] {
    try {
      let hierarchy: string[] = [];
      const hierarchyArrays = requiredRoles.map((requiredRole) => {
        const roleResultArray = this.roleHierarchy.map((roleHierarchy) => {
          const result = (roleHierarchy.includedRoles.includes(requiredRole))?roleHierarchy.role:requiredRole;
          return result;
        });
        return _.union(roleResultArray);
      });
      hierarchy = _.uniq(_.concat(...hierarchyArrays));
      return hierarchy;
    }
    catch (error) {
      console.log(error);
      return ['ERROR'];
    }
  }

}

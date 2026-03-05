import {isAllowedAction} from "@/lib";
import {Reflector} from "@nestjs/core";
import {AccessRequest, BaseException} from "@/types";
import {IS_PUBLIC_KEY, PERMISSION_METADATA, type PermissionDecoratorParams, PermissionsType} from "@/common";
import {CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException} from "@nestjs/common";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AccessRequest>();

    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const {requiredAll, permissions: requiredPermissions} = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) || {requiredAll: false, permissions: []};

    if (!requiredPermissions) throw new InternalServerErrorException({
      message: 'Missing Role, Role is Required',
      error: "Role Not Send",
    } as BaseException);

    const actionPermissions = req.user.permissions as PermissionsType[];

    const isAllowed: boolean = isAllowedAction({
      requiredAll,
      requiredPermissions,
      actionPermissions,
    });

    if (!isAllowed) throw new ForbiddenException({
      message: "Your role not access to this action.",
      error: "Permission Denied",
    } as BaseException);

    return true;
  }
}
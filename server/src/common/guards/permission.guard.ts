import {isAllowedAction} from "@/lib";
import {Reflector} from "@nestjs/core";
import {AccessRequest, BaseException} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {IS_PUBLIC_KEY, PERMISSION_METADATA, type DynamicDelegate, type PermissionDecoratorParams, type PermissionsType, FindDynamicDelegate, PERMISSIONS} from "@/common";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AccessRequest>();

    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const {requiredAll, permissions: requiredPermissions, owner, resource} = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) || {requiredAll: false, permissions: [], resource: undefined, owner: false};

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

    if (owner && resource && !actionPermissions.includes(PERMISSIONS.OWNER_ALL)) {
      const prismaDelegate = this.prisma[resource] as unknown as DynamicDelegate;

      const data = await prismaDelegate.findUnique({
        where: {
          id: req.params['id'] as string | undefined
        }
      });

      this.checkOwnership(data, req.user.userId, resource);
    }

    return true;
  }

  checkOwnership(data: FindDynamicDelegate | undefined, userId: string, resource: string): boolean {
    if (!data) throw new NotFoundException({
      message: `${resource} not exist in database`,
      error: `${resource} not found`,
    } as BaseException);

    if (!data.creator) throw new InternalServerErrorException({
      message: `creator column not found, please make sure this data has creator column`,
      error: `creator not found`,
    } as BaseException);

    if (data.creator !== userId) throw new ForbiddenException({
      message: "Access denied. Only the creator of this resource is allowed to perform this action.",
      error: "Ownership Verification Failed"
    } as BaseException);

    return true;
  }
}
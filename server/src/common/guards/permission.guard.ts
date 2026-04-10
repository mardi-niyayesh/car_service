import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";

import {
  PERMISSIONS,
  IS_PUBLIC_KEY,
  FindDynamicDelegate,
  PERMISSION_METADATA,
  type DynamicDelegate,
  type PermissionsType,
  type PermissionDecoratorParams,
} from "@/common";

import {Reflector} from "@nestjs/core";
import {BaseException, OwnershipRequest, RoleIncludeType} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {getSafeRole} from "@/lib";

interface IsAllowedActionParams {
  requiredAll?: boolean;
  actionPermissions: PermissionsType[];
  requiredPermissions: PermissionsType[];
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<OwnershipRequest<FindDynamicDelegate>>();

    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const {
      owner,
      resource,
      requiredAll,
      permissions: requiredPermissions,
      include
    } = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) || {
      owner: false,
      permissions: [],
      requiredAll: false,
      resource: undefined,
      include: undefined
    };

    if (!requiredPermissions.length) throw new InternalServerErrorException({
      message: "Missing Permission, Permission is Required",
      error: "Permission Not Send",
    } as BaseException);

    const actionPermissions = req.user.permissions as PermissionsType[];

    const isAllowed: boolean = this.isAllowedAction({
      requiredAll,
      requiredPermissions,
      actionPermissions,
    });

    if (!isAllowed) {
      const missingPermissions = requiredPermissions.filter(
        p => !actionPermissions.includes(p)
      );

      throw new ForbiddenException({
        message: "You do not have sufficient permissions to perform this action.",
        error: "Permission Denied",
        resource: resource ?? undefined,
        required_permissions: requiredPermissions,
        missing_permissions: missingPermissions,
        required_mode: requiredAll ? "ALL" : "ANY"
      } as BaseException);
    }

    if (owner && resource) {
      const prismaDelegate = this.prisma[resource] as unknown as DynamicDelegate;

      const data = await prismaDelegate.findUnique({
        where: {
          id: req.params['id'] as string | undefined
        },
        include: include === undefined ? undefined : include,
      });

      if (data) req.ownershipData = data;

      return this.checkOwnership(data, req.user.userId, resource, actionPermissions);
    }

    return true;
  }

  isAllowedAction(
    {
      actionPermissions,
      requiredPermissions,
      requiredAll = false,
    }: IsAllowedActionParams
  ): boolean {
    if (!requiredPermissions.length) throw new InternalServerErrorException({
      message: "Required permissions cannot be empty",
      error: "requiredPermissions is empty",
    } as BaseException);

    const permissionSet = new Set(actionPermissions);

    // if owner
    if (permissionSet.has(PERMISSIONS.OWNER_ALL)) return true;

    if (requiredAll) return requiredPermissions.every(p => permissionSet.has(p));

    return requiredPermissions.some(p => permissionSet.has(p));
  }

  checkOwnership(
    data: FindDynamicDelegate | undefined,
    userId: string,
    resource: string,
    actionPermissions: PermissionsType[]
  ): boolean {
    if (!data) throw new NotFoundException({
      message: `this ${resource} does not exist in database`,
      error: `${resource} not found`,
    } as BaseException);

    if (data.creator_id === undefined) throw new InternalServerErrorException({
      message: `creator column not found, please make sure this data has creator column`,
      error: `creator not found`,
    } as BaseException);

    if (data.creator_id === null) return true;

    if (actionPermissions.includes(PERMISSIONS.OWNER_ALL)) return true;

    if (data.creator_id && data.creator_id !== userId) throw new ForbiddenException({
      message: "Access denied. Only the creator of this resource is allowed to perform this action.",
      error: "Ownership Verification Failed"
    } as BaseException);

    return true;
  }
}
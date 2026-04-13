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
  PERMISSION_METADATA,
  type DynamicDelegate,
  type PermissionsType,
  type FindDynamicDelegate,
  type PublicDecoratorParams,
  type PermissionDecoratorParams,
} from "@/common";

import {checkZod} from "@/lib";
import {Reflector} from "@nestjs/core";
import type {BaseException, OwnershipRequest} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";

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

    const isPublic = this.reflector.getAllAndOverride<PublicDecoratorParams>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || {
      makePublicAccessGuard: false,
      makePublicPermissionGuard: false,
    };

    if (isPublic.makePublicPermissionGuard) return true;

    const {
      owner,
      resource,
      requiredAll,
      permissions: requiredPermissions,
      include,
      validatorParam
    } = this.reflector.getAllAndOverride<PermissionDecoratorParams>(PERMISSION_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]) || {
      owner: false,
      permissions: [],
      requiredAll: false,
      resource: undefined,
      include: undefined,
      validatorParam: undefined
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

      const rawId = req.params['id'];
      const id: string = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!validatorParam) throw new InternalServerErrorException({
        error: "Missing validator param for ownership permission guard.",
        message: `Please specify a validator param for ownership permission guard. for route: ${resource}/:id /${req.method}`,
      } as BaseException);

      checkZod(validatorParam, id);

      const data = await prismaDelegate.findUnique({
        where: {
          id
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
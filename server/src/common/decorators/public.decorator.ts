import {SetMetadata} from '@nestjs/common';

export interface PublicDecoratorParams {
  makePublicAccessGuard?: boolean;
  makePublicPermissionGuard?: boolean;
}

export const IS_PUBLIC_KEY = "IS_PUBLIC";

export function Public(params: PublicDecoratorParams = {makePublicPermissionGuard: true, makePublicAccessGuard: true}) {
  return SetMetadata(IS_PUBLIC_KEY, {
    makePublicAccessGuard: params.makePublicAccessGuard,
    makePublicPermissionGuard: params.makePublicPermissionGuard,
  });
}
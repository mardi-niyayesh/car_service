import type {Request} from "express";
import {FindDynamicDelegate} from "@/common";
import {RefreshTokenPayload, AccessTokenPayload} from "@/types";

export interface NormalizedClientInfo {
  ip: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  lang: string | null;
}

export interface RefreshRequest extends Request {
  refreshPayload: RefreshTokenPayload;
}

export type UserAccess = Omit<AccessTokenPayload, "sub"> & { userId: string };

export interface AccessRequest extends Request {
  user: UserAccess;
}

/** find data type in ownership permissions requests */
export interface OwnershipRequest<T extends FindDynamicDelegate> extends AccessRequest {
  ownershipData: T;
}
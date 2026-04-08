import 'dotenv/config';
import {ApiProperty} from "@nestjs/swagger";
import {PermissionsType, Resource} from "@/common";
import {getDefaultMessage} from "@/lib/utils/response";
import {ApiResponse, BaseApiResponseData, ZodFieldError} from "@/types";

const BASE_URL: string = process.env.BASE_URL ?? "api/v1";

function getFormatPath(path: string): string {
  if (
    path.startsWith(BASE_URL)
    || path.startsWith(`/${BASE_URL}`)
    || path.startsWith(BASE_URL.slice(1))
  ) {
    return path;
  }
  return `/api/v1${path}`;
}

interface GetNormalErrorTypes {
  message: string;
  statusCode: number;
  path: string;
  error: string;
  resource?: string;
  required_permissions?: string[];
  missing_permissions?: string[];
  required_mode?: string;
}

/** normal example error  */
export function getNormalErrorResponse(props: GetNormalErrorTypes) {
  class NormalErrorResponse {
    @ApiProperty({example: props.statusCode})
    statusCode: number;

    @ApiProperty({example: false})
    success: boolean;

    @ApiProperty({example: getDefaultMessage(props.statusCode)})
    detail: string;

    @ApiProperty({example: getFormatPath(props.path)})
    path: string;

    @ApiProperty({example: "2026-02-08T02:11:20.630Z"})
    timestamp: string;

    @ApiProperty({example: props.message})
    message: string;

    @ApiProperty({example: props.error})
    error: string;

    @ApiProperty({example: props.resource ?? 'example_resource'})
    resource?: string;

    @ApiProperty({example: props.required_permissions ?? ['user.view', 'role.assign']})
    required_permissions?: string[];

    @ApiProperty({example: props.missing_permissions ?? ['role.assign']})
    missing_permissions?: string[];

    @ApiProperty({example: props.required_mode ?? 'ALL'})
    required_mode?: string;
  }

  return NormalErrorResponse;
}

function getDynamicClassName(source: string, path: string): string {
  return `${source}_${path.replace(/[:/]/g, "_")}`;
}

/** example response when user not authorized */
export function getUnauthorizedResponse(path: string) {
  const className: string = getDynamicClassName("Unauthorized", path);
  return {
    [className]: class extends getNormalErrorResponse({
      message: "Access token missing or expired.",
      statusCode: 401,
      error: "accessToken Expires",
      path
    }) {}
  }[className];
}

/** example response when too many requests from one ip in 1 minutes */
export class TooManyRequestResponse extends getNormalErrorResponse({
  message: "Too many requests. Try again 5 minutes later.",
  path: "auth/register",
  error: "Too Many Requests From Your IP",
  statusCode: 429
}) {}

interface GetForbiddenResponse {
  resource?: Resource;
  required_permissions?: PermissionsType[];
  missing_permissions?: PermissionsType[];
  required_mode?: 'ALL' | 'ANY';
}

/** get schema for swagger when not allowed */
export function getForbiddenResponse(path: string, data?: GetForbiddenResponse) {
  const className: string = getDynamicClassName("Forbidden", path);
  return {
    [className]: class extends getNormalErrorResponse({
      message: "You do not have sufficient permissions to perform this action.",
      statusCode: 403,
      error: "Permission Denied",
      path,
      resource: data?.resource ?? 'test_resource',
      required_permissions: data?.required_permissions ?? [
        "user.view"
      ],
      missing_permissions: data?.missing_permissions ?? [
        "user.view"
      ],
      required_mode: data?.required_mode ?? "ANY"
    }) {}
  }[className];
}

/** get schema when request is ok */
export function getBaseOkResponseSchema<T>(props: { create?: boolean, response: ApiResponse<T>, path: string }) {
  const responseData = props.response as BaseApiResponseData<T>;

  const response = {
    message: props.response.message,
  };

  if ("data" in responseData) {
    (response as typeof responseData).data = responseData.data;
  }

  class BaseOkResponse {
    @ApiProperty({example: props.create ? 201 : 200})
    statusCode: number;

    @ApiProperty({example: true})
    success: boolean;

    @ApiProperty({example: props.create ? "Resource Created" : "Resource Successfully"})
    detail: string;

    @ApiProperty({example: getFormatPath(props.path)})
    path: string;

    @ApiProperty({example: "2026-02-08T02:11:20.630Z"})
    timestamp: string;

    @ApiProperty({
      example: response
    })
    response: {
      message: string;
      data?: T;
    };
  }

  return BaseOkResponse;
}

type GetZodErrorTypes = Pick<GetNormalErrorTypes, "path"> & {
  errors: ZodFieldError[];
}

/** get schema for swagger when zod validate not success */
export function getZodErrorBody(props: GetZodErrorTypes) {
  class ZodErrorResponse {
    @ApiProperty({example: 400})
    statusCode: number;

    @ApiProperty({example: false})
    success: boolean;

    @ApiProperty({example: "Invalid Request."})
    detail: string;

    @ApiProperty({example: getFormatPath(props.path)})
    path: string;

    @ApiProperty({example: "2026-02-08T02:11:20.630Z"})
    timestamp: string;

    @ApiProperty({example: "Invalid Request."})
    message: string;

    @ApiProperty({example: props.errors})
    errors: ZodFieldError[];
  }

  return ZodErrorResponse;
}

export function getBadRequestUUIDParams(path: string) {
  const className: string = getDynamicClassName("BadRequest", path);

  return {
    [className]: class extends getZodErrorBody({
      path,
      errors: [{field: "id", error: "Invalid UUIDv4"}],
    }) {}
  }[className];
}
/** base response for exceptions and ok responses */
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  detail: string;
  timestamp: string;
  path?: string;
}

/** API Responses without data */
export interface BaseApiResponse {
  message: string;
}

/** API Responses with data */
export interface BaseApiResponseData<T> extends BaseApiResponse {
  data: T;
}

/** Base API Responses */
export type ApiResponse<T> = T extends void ? BaseApiResponse : BaseApiResponseData<T>;

/** schema response when request is ok */
export interface InterceptorResponse<T> extends BaseResponse {
  response: BaseApiResponseData<T> | BaseApiResponse;
}

/** params type for get schema for swagger when zod validate not success */
export interface ZodFieldError {
  field: string;
  error: string;
}

/** base error type */
export interface BaseException {
  message: string;
  error: string;
}

/** type of zod error response */
export interface ZodException {
  message: string;
  errors: ZodFieldError[];
}

/** base exception response */
export type ZodExceptionRes = & BaseResponse & ZodException;
export type BaseExceptionRes = & BaseResponse & BaseException & {
  [key: string]: unknown;
};

/** return a list of data with count */
export type ListWithCount<T> = T & {
  count: number;
};
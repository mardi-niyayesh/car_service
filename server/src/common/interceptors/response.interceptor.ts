import {Observable, map} from 'rxjs';
import type {Response, Request} from "express";
import {getDefaultMessage, getServerTime} from "@/lib";
import type {BaseApiResponse, BaseApiResponseData, InterceptorResponse} from "@/types";
import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';

@Injectable()
export class ResponseInterceptors<T> implements NestInterceptor<BaseApiResponse | BaseApiResponseData<T>, InterceptorResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<BaseApiResponse | BaseApiResponseData<T>>
  ): Observable<InterceptorResponse<T>> | Promise<Observable<InterceptorResponse<T>>> {

    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    return next.handle().pipe(
      map(response => {
        const statusCode: number = res.statusCode;

        return {
          statusCode,
          success: statusCode >= 200 && statusCode < 300,
          detail: getDefaultMessage(statusCode),
          path: req.url,
          timestamp: getServerTime(),
          response,
        };
      })
    );
  }
}

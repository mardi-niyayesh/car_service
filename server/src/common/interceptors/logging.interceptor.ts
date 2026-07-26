import {Observable, tap} from "rxjs";
import type {Request} from "express";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> | Promise<Observable<T>> {
    const before: number = Date.now();
    const date: Date = new Date();

    const req = context.switchToHttp().getRequest<Request>();
    console.log(`started in ${date.toISOString()} to url: ${req.originalUrl} on method: ${req.method} by ip: ${req.ip}`);

    return next.handle().pipe(
      tap(() => {
        const after: number = Date.now();
        console.log((after - before) / 1000);
        console.log("end.");
      })
    );
  }
}

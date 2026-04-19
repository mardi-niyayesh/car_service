import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";

import * as AuthDto from "../dto";
import {CacheEvict, RefreshTokenGuard, TooManyRequestResponse} from "@/common";
import {applyDecorators, HttpCode, HttpStatus, UseGuards} from "@nestjs/common";

export const RegisterDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    CacheEvict({prefix: '*users:list*'}),
    ApiOperation(AuthDto.authRegisterOperation),
    ApiBody({type: AuthDto.CreateUserSchema}),
    ApiCreatedResponse({type: AuthDto.CreateUserOkResponse}),
    ApiBadRequestResponse({type: AuthDto.CreateUserBadRequestResponse}),
    ApiConflictResponse({type: AuthDto.CreateUserConflictResponse}),
    ApiTooManyRequestsResponse({type: TooManyRequestResponse}),
  );
};

export const LoginDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation(AuthDto.authLoginOperation),
    ApiBody({type: AuthDto.LoginUserSchema}),
    ApiOkResponse({type: AuthDto.LoginUserOkResponse}),
    ApiBadRequestResponse({type: AuthDto.LoginUserBadRequestResponse}),
    ApiUnauthorizedResponse({type: AuthDto.LoginUserInvalidAuthResponse}),
  );
};

export const RefreshDecorators = () => {
  return applyDecorators(
    UseGuards(RefreshTokenGuard),
    HttpCode(HttpStatus.OK),
    ApiOperation(AuthDto.authRefreshOperation),
    ApiCookieAuth("refreshToken"),
    ApiOkResponse({type: AuthDto.RefreshUsersOkResponse}),
    ApiUnauthorizedResponse({type: AuthDto.RefreshUsersUnAuthResponse}),
  );
};

export const LogoutDecorators = () => {
  return applyDecorators(
    UseGuards(RefreshTokenGuard),
    HttpCode(HttpStatus.OK),
    ApiOperation(AuthDto.authLogoutOperation),
    ApiCookieAuth("refreshToken"),
    ApiOkResponse({type: AuthDto.LogoutOkResponse}),
    ApiUnauthorizedResponse({type: AuthDto.RefreshUsersUnAuthResponse}),
    ApiForbiddenResponse({type: AuthDto.RefreshForbiddenResponse}),
  );
};

export const ForgotPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({type: AuthDto.ForgotPasswordSchema}),
    ApiOperation(AuthDto.authForgotPasswordOperation),
    ApiOkResponse({type: AuthDto.OkForgotPasswordRes}),
    ApiNotFoundResponse({
      type: AuthDto.NotFoundUserForgotPassRes,
      description: 'The requested user does not exist in the database.'
    }),
    ApiConflictResponse({
      type: AuthDto.ConflictForgotPasswordRes,
      description: `
  A password reset token is already active for this user.
     
  - **Please check your email for the existing reset link. 
  - **You must wait until the token expires before requesting a new one.`
    }),
  );
};

export const ResetPasswordDecorators = () => {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({type: AuthDto.ResetPasswordSchema}),
    ApiOperation(AuthDto.authResetPasswordOperation),
    ApiOkResponse({type: AuthDto.OkResetPasswordRes}),
    ApiBadRequestResponse({type: AuthDto.BadRequestResetPasswordRes}),
    ApiNotFoundResponse({type: AuthDto.NotFoundResetPasswordRes}),
  );
};
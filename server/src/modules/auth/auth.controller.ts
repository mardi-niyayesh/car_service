import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCookieAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";

import * as AuthDto from "./dto";
import {isProduction} from "@/lib";
import {AuthService} from "./auth.service";
import type {CookieOptions, Response} from "express";
import {BaseUserSchema} from "../user/dto/validators.dto";
import {Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import type {RefreshRequest, LoginResponse, ApiResponse, UserResponse, NormalizedClientInfo} from "@/types";
import {RefreshTokenGuard, ZodPipe, TooManyRequestResponse, Public, NormalizeClientInfo, CacheEvict} from "@/common";

/**
 * Authentication endpoints for user registration, login, and token refresh.
 *
 * This controller handles:
 * - Creating new user accounts
 * - Authenticating users with email/password
 * - Issuing access tokens
 * - Refreshing access tokens using secure httpOnly cookies
 * - Logout users in system and revoked refresh token
 */
@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** get same refreshToken options */
  getCookieOptions(maxAge?: number): CookieOptions {
    return {
      sameSite: isProduction ? "strict" : "lax",
      httpOnly: true,
      secure: isProduction,
      path: "/",
      maxAge
    };
  }

  /**
   * Creating new user accounts
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @CacheEvict({prefix: '*users:list*'})
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user record in the database and returns the created user.',
    operationId: 'auth_register'
  })
  @ApiBody({type: AuthDto.CreateUserSchema})
  @ApiCreatedResponse({type: AuthDto.CreateUserOkResponse})
  @ApiBadRequestResponse({type: AuthDto.CreateUserBadRequestResponse})
  @ApiConflictResponse({type: AuthDto.CreateUserConflictResponse})
  @ApiTooManyRequestsResponse({type: TooManyRequestResponse})
  register(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(BaseUserSchema)) data: AuthDto.CreateUserInput
  ): Promise<ApiResponse<UserResponse>> {
    return this.authService.register(data, clientInfo);
  }

  /**
   * Authenticating users with email/password and Issuing access tokens
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Validates user credentials and returns an access token. Also sets a secure httpOnly refresh token cookie.',
    operationId: 'auth_login'
  })
  @ApiBody({type: AuthDto.LoginUserSchema})
  @ApiOkResponse({type: AuthDto.LoginUserOkResponse})
  @ApiBadRequestResponse({type: AuthDto.LoginUserBadRequestResponse})
  @ApiUnauthorizedResponse({type: AuthDto.LoginUserInvalidAuthResponse})
  async login(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(AuthDto.LoginUser)) data: AuthDto.LoginUserInput,
    @Res({passthrough: true}) res: Response
  ): Promise<ApiResponse<LoginResponse>> {
    const loginResponse = await this.authService.login(data, clientInfo);

    const remember: number = data.remember
      ? 7 * 24 * 60 * 60 * 1000
      : 12 * 60 * 60 * 1000;

    res.cookie("refreshToken", loginResponse.refreshToken, this.getCookieOptions(remember));

    return {
      message: "user logged in successfully",
      data: {
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
      }
    };
  }

  /** Refreshing access tokens using secure httpOnly cookies */
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Uses the refresh token (from httpOnly cookie) to generate a new access token.',
    operationId: 'auth_refresh'
  })
  @ApiCookieAuth("refreshToken")
  @ApiOkResponse({type: AuthDto.RefreshUsersOkResponse})
  @ApiUnauthorizedResponse({type: AuthDto.RefreshUsersUnAuthResponse})
  refresh(
    @Req() req: RefreshRequest
  ): ApiResponse<LoginResponse> {
    const accessToken: string = this.authService.refresh(req.refreshPayload);

    const data: LoginResponse = {
      user: {
        roles: req.refreshPayload.user.roles,
        display_name: req.refreshPayload.user.display_name,
        created_at: req.refreshPayload.user.created_at,
        age: req.refreshPayload.user.age,
        updated_at: req.refreshPayload.user.updated_at,
        email: req.refreshPayload.user.email,
        id: req.refreshPayload.user.id,
        permissions: req.refreshPayload.user.permissions
      },
      accessToken
    };

    return {
      message: "accessToken successfully created.",
      data
    };
  }

  /** Logout users in system and revoked refresh token */
  @UseGuards(RefreshTokenGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Uses the refresh token (from httpOnly cookie) to logout user in system and revoked refresh token.',
    operationId: 'auth_logout'
  })
  @ApiCookieAuth("refreshToken")
  @ApiOkResponse({type: AuthDto.LogoutOkResponse})
  @ApiUnauthorizedResponse({type: AuthDto.RefreshUsersUnAuthResponse})
  @ApiForbiddenResponse({type: AuthDto.RefreshForbiddenResponse})
  logout(
    @Req() req: RefreshRequest,
    @Res({passthrough: true}) res: Response
  ): Promise<ApiResponse<void>> {
    res.clearCookie("refreshToken", this.getCookieOptions());
    return this.authService.logout(req.refreshPayload);
  }

  /** Send Email for Reset password */
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: AuthDto.ForgotPasswordSchema})
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Starts the password reset process by sending a reset link to the user email.',
    operationId: 'auth_forgot_password'
  })
  @ApiOkResponse({type: AuthDto.OkForgotPasswordRes})
  @ApiNotFoundResponse({
    type: AuthDto.NotFoundUserForgotPassRes,
    description: 'The requested user does not exist in the database.'
  })
  @ApiConflictResponse({
    type: AuthDto.ConflictForgotPasswordRes,
    description: `
  A password reset token is already active for this user.
     
  - **Please check your email for the existing reset link. 
  - **You must wait until the token expires before requesting a new one.`
  })
  forgotPassword(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(AuthDto.ForgotPassword)) body: AuthDto.ForgotPasswordType
  ): Promise<ApiResponse<AuthDto.ForgotApiResponse>> {
    return this.authService.forgotPassword(body.email, clientInfo);
  }

  /** reset password with token */
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: AuthDto.ResetPasswordSchema})
  @ApiOperation({
    summary: 'Reset password with token',
    description: 'Complete the password reset process by providing the reset token (received via email) and the new password. The token must be valid and not expired.',
    operationId: 'auth_reset_password'
  })
  @ApiOkResponse({type: AuthDto.OkResetPasswordRes})
  @ApiBadRequestResponse({type: AuthDto.BadRequestResetPasswordRes})
  @ApiNotFoundResponse({type: AuthDto.NotFoundResetPasswordRes})
  resetPassword(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(AuthDto.ResetPassword)) body: AuthDto.ResetPasswordType
  ): Promise<ApiResponse<void>> {
    return this.authService.resetPassword(body.token, body.password, clientInfo);
  }
}
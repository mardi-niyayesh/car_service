import * as AuthDto from "./dto";
import {isProduction} from "@/lib";
import {ApiTags} from "@nestjs/swagger";
import {AuthService} from "./auth.service";
import * as AuthDecorator from "./decorators";
import type {CookieOptions, Response} from "express";
import {BaseUserSchema} from "../user/dto/validators.dto";
import {ZodPipe, Public, NormalizeClientInfo} from "@/common";
import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import type {RefreshRequest, LoginResponse, ApiResponse, UserResponse, NormalizedClientInfo} from "@/types";

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
  @AuthDecorator.RegisterDecorators()
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
  @AuthDecorator.LoginDecorators()
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
  @Post("refresh")
  @AuthDecorator.RefreshDecorators()
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
  @Post("logout")
  @AuthDecorator.LogoutDecorators()
  logout(
    @Req() req: RefreshRequest,
    @Res({passthrough: true}) res: Response
  ): Promise<ApiResponse<void>> {
    res.clearCookie("refreshToken", this.getCookieOptions());
    return this.authService.logout(req.refreshPayload);
  }

  /** Send Email for Reset password */
  @Post("forgot-password")
  @AuthDecorator.ForgotPasswordDecorators()
  forgotPassword(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(AuthDto.ForgotPassword)) body: AuthDto.ForgotPasswordType
  ): Promise<ApiResponse<AuthDto.ForgotApiResponse>> {
    return this.authService.forgotPassword(body.email, clientInfo);
  }

  /** reset password with token */
  @Post("reset-password")
  @AuthDecorator.ResetPasswordDecorators()
  resetPassword(
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Body(new ZodPipe(AuthDto.ResetPassword)) body: AuthDto.ResetPasswordType
  ): Promise<ApiResponse<void>> {
    return this.authService.resetPassword(body.token, body.password, clientInfo);
  }
}
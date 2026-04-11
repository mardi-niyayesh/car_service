import {ApiOperationOptions} from "@nestjs/swagger/dist/decorators/api-operation.decorator";

export const authRegisterOperation: ApiOperationOptions = {
  summary: 'Register a new user',
  description: 'Creates a new user record in the database and returns the created user.',
  operationId: 'auth_register'
};

export const authLoginOperation: ApiOperationOptions = {
  summary: 'Authenticate user',
  description: 'Validates user credentials and returns an access token. Also sets a secure httpOnly refresh token cookie.',
  operationId: 'auth_login'
};

export const authLogoutOperation: ApiOperationOptions = {
  summary: 'Logout user',
  description: 'Uses the refresh token (from httpOnly cookie) to logout user in system and revoked refresh token.',
  operationId: 'auth_logout'
};

export const authRefreshOperation: ApiOperationOptions = {
  summary: 'Refresh access token',
  description: 'Uses the refresh token (from httpOnly cookie) to generate a new access token.',
  operationId: 'auth_refresh'
};

export const authForgotPasswordOperation: ApiOperationOptions = {
  summary: 'Forgot password',
  description: 'Starts the password reset process by sending a reset link to the user email.',
  operationId: 'auth_forgot_password'
};

export const authResetPasswordOperation: ApiOperationOptions = {
  summary: 'Reset password with token',
  description: 'Complete the password reset process by providing the reset token (received via email) and the new password. The token must be valid and not expired.',
  operationId: 'auth_reset_password'
};
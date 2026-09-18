import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { AuthService } from '../application/auth.service.js';
import type { SignInContract } from '../application/contracts/sign-in.contract.js';
import type { SignUpContract } from '../application/contracts/sign-up.contract.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';
import { AuthCookieService } from './auth-cookie.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { CurrentUserPayload } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { SessionInfo } from './decorators/session-info.decorator.js';
import { MobileRefreshDto } from './dto/mobile-refresh.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { SignUpDto } from './dto/sign-up.dto.js';

interface MobileRefreshInput {
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookieService,
  ) {}

  @ApiBody({ type: SignUpDto })
  @Public()
  @Post('sign-up')
  async signUp(
    @Body(new ZodValidationPipe(SignUpDto)) dto: SignUpContract,
    @SessionInfo() session: SessionInfoPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.signUp(dto, session);
    this.cookies.set(response, result);

    return { user: result.user };
  }

  @ApiBody({ type: SignInDto })
  @Public()
  @Post('sign-in')
  async signIn(
    @Body(new ZodValidationPipe(SignInDto)) dto: SignInContract,
    @SessionInfo() session: SessionInfoPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.signIn(dto, session);
    this.cookies.set(response, result);

    return { user: result.user };
  }

  @ApiBody({ type: SignUpDto })
  @Public()
  @Post('mobile/sign-up')
  mobileSignUp(
    @Body(new ZodValidationPipe(SignUpDto)) dto: SignUpContract,
    @SessionInfo() session: SessionInfoPayload,
  ) {
    return this.auth.signUp(dto, session);
  }

  @ApiBody({ type: SignInDto })
  @Public()
  @Post('mobile/sign-in')
  mobileSignIn(
    @Body(new ZodValidationPipe(SignInDto)) dto: SignInContract,
    @SessionInfo() session: SessionInfoPayload,
  ) {
    return this.auth.signIn(dto, session);
  }

  @ApiBody({ type: MobileRefreshDto })
  @Public()
  @Post('mobile/refresh')
  mobileRefresh(
    @Body(new ZodValidationPipe(MobileRefreshDto)) dto: MobileRefreshInput,
    @SessionInfo() session: SessionInfoPayload,
  ) {
    return this.auth.refresh(dto.refreshToken, session);
  }

  @ApiBody({ type: MobileRefreshDto })
  @Public()
  @Post('mobile/sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async mobileSignOut(
    @Body(new ZodValidationPipe(MobileRefreshDto)) dto: MobileRefreshInput,
  ): Promise<void> {
    await this.auth.signOut(dto.refreshToken);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @SessionInfo() session: SessionInfoPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.refresh(
      this.cookies.get(request).refreshToken!,
      session,
    );
    this.cookies.set(response, result);

    return { user: result.user };
  }

  @Public()
  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.auth.signOut(this.cookies.get(request).refreshToken);
    this.cookies.clear(response);
  }

  @ApiCookieAuth('access_token')
  @Get('sessions')
  sessions(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.sessions(user.sub);
  }

  @ApiCookieAuth('access_token')
  @Get('me')
  currentUser(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.currentUser(user.sub);
  }

  @ApiCookieAuth('access_token')
  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  revoke(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.auth.revokeSession(user.sub, id);
  }
}

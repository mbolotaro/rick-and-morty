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
import { AuthService } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import type { CurrentUserPayload } from './current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import {
  MobileRefreshSchema,
  type MobileRefreshInput,
  SignInSchema,
  type SignInInput,
  SignUpSchema,
  type SignUpInput,
} from './presentation/schemas/auth.schemas.js';
import { Public } from './public.decorator.js';
import { AuthCookieService } from './auth-cookie.service.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookieService,
  ) {}

  private session(req: Request) {
    return { ip: req.ip, userAgent: req.get('user-agent') };
  }

  @ApiBody({
    schema: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        firstName: { type: 'string', maxLength: 100 },
        lastName: { type: 'string', maxLength: 100 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password', minLength: 8, maxLength: 72 },
      },
    },
  })
  @Public() @Post('sign-up') async signUp(
    @Body(new ZodValidationPipe(SignUpSchema)) dto: SignUpInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.signUp(dto, this.session(req));
    this.cookies.set(res, r);
    return { user: r.user };
  }

  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
    },
  })
  @Public() @Post('sign-in') async signIn(
    @Body(new ZodValidationPipe(SignInSchema)) dto: SignInInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.signIn(dto, this.session(req));
    this.cookies.set(res, r);
    return { user: r.user };
  }

  @Public() @Post('mobile/sign-up') async mobileSignUp(
    @Body(new ZodValidationPipe(SignUpSchema)) dto: SignUpInput,
    @Req() req: Request,
  ) {
    return this.auth.signUp(dto, this.session(req));
  }

  @Public() @Post('mobile/sign-in') async mobileSignIn(
    @Body(new ZodValidationPipe(SignInSchema)) dto: SignInInput,
    @Req() req: Request,
  ) {
    return this.auth.signIn(dto, this.session(req));
  }

  @Public() @Post('mobile/refresh') async mobileRefresh(
    @Body(new ZodValidationPipe(MobileRefreshSchema)) dto: MobileRefreshInput,
    @Req() req: Request,
  ) {
    return this.auth.refresh(dto.refreshToken, this.session(req));
  }

  @Public()
  @Post('mobile/sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async mobileSignOut(
    @Body(new ZodValidationPipe(MobileRefreshSchema)) dto: MobileRefreshInput,
  ): Promise<void> {
    await this.auth.signOut(dto.refreshToken);
  }

  @Public() @Post('refresh') async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.refresh(
      this.cookies.get(req).refreshToken!,
      this.session(req),
    );
    this.cookies.set(res, r);
    return { user: r.user };
  }

  @Public() @Post('sign-out') @HttpCode(HttpStatus.NO_CONTENT) async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.signOut(this.cookies.get(req).refreshToken);
    this.cookies.clear(res);
  }

  @ApiCookieAuth('access_token')
  @Get('sessions') sessions(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.sessions(user.sub);
  }

  @ApiCookieAuth('access_token')
  @Get('me') currentUser(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.currentUser(user.sub);
  }

  @ApiCookieAuth('access_token')
  @Delete('sessions/:id') @HttpCode(HttpStatus.NO_CONTENT) revoke(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.auth.revokeSession(user.sub, id);
  }
}

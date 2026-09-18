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
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './current-user.decorator.js';
import type { CurrentUserPayload } from './current-user.decorator.js';
import { MobileRefreshDto, SignInDto, SignUpDto } from './dto.js';
import { Public } from './public.decorator.js';
import { AuthCookieService } from './auth-cookie.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookieService,
  ) {}

  private session(req: Request) {
    return { ip: req.ip, userAgent: req.get('user-agent') };
  }

  @Public() @Post('sign-up') async signUp(
    @Body() dto: SignUpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.signUp(dto, this.session(req));
    this.cookies.set(res, r);
    return { user: r.user };
  }

  @Public() @Post('sign-in') async signIn(
    @Body() dto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.auth.signIn(dto, this.session(req));
    this.cookies.set(res, r);
    return { user: r.user };
  }

  @Public() @Post('mobile/sign-up') async mobileSignUp(
    @Body() dto: SignUpDto,
    @Req() req: Request,
  ) {
    return this.auth.signUp(dto, this.session(req));
  }

  @Public() @Post('mobile/sign-in') async mobileSignIn(
    @Body() dto: SignInDto,
    @Req() req: Request,
  ) {
    return this.auth.signIn(dto, this.session(req));
  }

  @Public() @Post('mobile/refresh') async mobileRefresh(
    @Body() dto: MobileRefreshDto,
    @Req() req: Request,
  ) {
    return this.auth.refresh(dto.refreshToken, this.session(req));
  }

  @Public() @Post('mobile/sign-out') @HttpCode(HttpStatus.NO_CONTENT)
  async mobileSignOut(@Body() dto: MobileRefreshDto): Promise<void> {
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

  @Get('sessions') sessions(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.sessions(user.sub);
  }

  @Delete('sessions/:id') @HttpCode(HttpStatus.NO_CONTENT) revoke(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.auth.revokeSession(user.sub, id);
  }
}

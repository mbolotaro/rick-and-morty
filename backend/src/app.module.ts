import { Module } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { EpisodesModule } from './modules/episodes/episodes.module.js';
import { EnvModule } from './modules/env/env.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';

@Module({
  providers: [AppService],
  imports: [EnvModule, PrismaModule, AuthModule, EpisodesModule],
})
export class AppModule {}

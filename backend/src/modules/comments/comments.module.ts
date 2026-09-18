import { Module } from '@nestjs/common';
import { RickAndMortyModule } from '../rick-and-morty/rick-and-morty.module.js';
import { CommentsService } from './application/comments.service.js';
import { CommentsRepository } from './application/ports/comments-repository.port.js';
import { PrismaCommentsRepository } from './infrastructure/prisma-comments.repository.js';
import { CommentsController } from './presentation/comments.controller.js';

@Module({
  imports: [RickAndMortyModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: CommentsRepository, useClass: PrismaCommentsRepository },
  ],
})
export class CommentsModule {}

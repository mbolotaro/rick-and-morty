import { Module } from '@nestjs/common';
import { CharactersModule } from '../characters/characters.module.js';
import { EpisodesModule } from '../episodes/episodes.module.js';
import { LocationsModule } from '../locations/locations.module.js';
import { CommentsService } from './application/comments.service.js';
import { CommentsController } from './presentation/comments.controller.js';

@Module({
  imports: [CharactersModule, LocationsModule, EpisodesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

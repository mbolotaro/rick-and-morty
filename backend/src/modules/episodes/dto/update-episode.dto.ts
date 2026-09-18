import { PartialType } from '@nestjs/mapped-types';
import { CreateEpisodeDto } from './create-episode.dto.js';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}

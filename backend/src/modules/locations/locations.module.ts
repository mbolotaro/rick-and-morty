import { Module } from '@nestjs/common';
import { RickAndMortyModule } from '../rick-and-morty/rick-and-morty.module.js';
import { LocationsService } from './application/locations.service.js';
import { LocationsController } from './presentation/locations.controller.js';
@Module({
  imports: [RickAndMortyModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}

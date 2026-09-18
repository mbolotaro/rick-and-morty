import { Injectable } from '@nestjs/common';
import { CharactersService } from '../../characters/application/characters.service.js';
import { CatalogEpisodesService } from '../../episodes/application/catalog-episodes.service.js';
import { LocationsService } from '../../locations/application/locations.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { FavoriteResource } from '../presentation/schemas/favorite-params.schema.js';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characters: CharactersService,
    private readonly locations: LocationsService,
    private readonly episodes: CatalogEpisodesService,
  ) {}

  async list(userId: string) {
    const [characters, locations, episodes] = await Promise.all([
      this.prisma.likedCharacter.findMany({
        where: { userId },
        select: { externalId: true },
        orderBy: { externalId: 'asc' },
      }),
      this.prisma.likedLocation.findMany({
        where: { userId },
        select: { externalId: true },
        orderBy: { externalId: 'asc' },
      }),
      this.prisma.likedEpisode.findMany({
        where: { userId },
        select: { externalId: true },
        orderBy: { externalId: 'asc' },
      }),
    ]);

    return {
      characters: characters.map(({ externalId }) => externalId),
      locations: locations.map(({ externalId }) => externalId),
      episodes: episodes.map(({ externalId }) => externalId),
    };
  }

  async status(userId: string, resource: FavoriteResource, externalId: number) {
    return { liked: await this.exists(userId, resource, externalId) };
  }

  async add(userId: string, resource: FavoriteResource, externalId: number) {
    await this.assertExternalResourceExists(resource, externalId);

    const data = { userId, externalId };

    switch (resource) {
      case 'characters':
        await this.prisma.likedCharacter.upsert({
          where: { userId_externalId: data },
          create: data,
          update: {},
        });
        break;
      case 'locations':
        await this.prisma.likedLocation.upsert({
          where: { userId_externalId: data },
          create: data,
          update: {},
        });
        break;
      case 'episodes':
        await this.prisma.likedEpisode.upsert({
          where: { userId_externalId: data },
          create: data,
          update: {},
        });
        break;
    }

    return { liked: true };
  }

  async remove(userId: string, resource: FavoriteResource, externalId: number) {
    const where = { userId, externalId };

    switch (resource) {
      case 'characters':
        await this.prisma.likedCharacter.deleteMany({ where });
        break;
      case 'locations':
        await this.prisma.likedLocation.deleteMany({ where });
        break;
      case 'episodes':
        await this.prisma.likedEpisode.deleteMany({ where });
        break;
    }

    return { liked: false };
  }

  private async exists(
    userId: string,
    resource: FavoriteResource,
    externalId: number,
  ): Promise<boolean> {
    const where = { userId, externalId };

    switch (resource) {
      case 'characters':
        return (await this.prisma.likedCharacter.count({ where })) > 0;
      case 'locations':
        return (await this.prisma.likedLocation.count({ where })) > 0;
      case 'episodes':
        return (await this.prisma.likedEpisode.count({ where })) > 0;
    }
  }

  private async assertExternalResourceExists(
    resource: FavoriteResource,
    externalId: number,
  ): Promise<void> {
    switch (resource) {
      case 'characters':
        await this.characters.getById(externalId);
        break;
      case 'locations':
        await this.locations.getById(externalId);
        break;
      case 'episodes':
        await this.episodes.getById(externalId);
        break;
    }
  }
}

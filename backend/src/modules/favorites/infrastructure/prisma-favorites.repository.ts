import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CatalogResource } from '../../rick-and-morty/application/contracts/catalog.models.js';
import {
  FavoritesRepository,
  type FavoriteCollection,
} from '../application/ports/favorites-repository.port.js';

@Injectable()
export class PrismaFavoritesRepository extends FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async list(userId: string): Promise<FavoriteCollection> {
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

  async exists(userId: string, resource: CatalogResource, externalId: number): Promise<boolean> {
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

  async add(userId: string, resource: CatalogResource, externalId: number): Promise<void> {
    const data = { userId, externalId };

    switch (resource) {
      case 'characters':
        await this.prisma.likedCharacter.upsert({
          where: { userId_externalId: data }, create: data, update: {},
        });
        return;
      case 'locations':
        await this.prisma.likedLocation.upsert({
          where: { userId_externalId: data }, create: data, update: {},
        });
        return;
      case 'episodes':
        await this.prisma.likedEpisode.upsert({
          where: { userId_externalId: data }, create: data, update: {},
        });
    }
  }

  async remove(userId: string, resource: CatalogResource, externalId: number): Promise<void> {
    const where = { userId, externalId };

    switch (resource) {
      case 'characters':
        await this.prisma.likedCharacter.deleteMany({ where });
        return;
      case 'locations':
        await this.prisma.likedLocation.deleteMany({ where });
        return;
      case 'episodes':
        await this.prisma.likedEpisode.deleteMany({ where });
    }
  }
}

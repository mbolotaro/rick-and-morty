import { Injectable } from '@nestjs/common';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { CatalogResource } from '../../rick-and-morty/application/contracts/catalog.models.js';
import { FavoritesRepository } from './ports/favorites-repository.port.js';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly repository: FavoritesRepository,
    private readonly catalog: CatalogGateway,
  ) {}

  async list(userId: string) {
    return this.repository.list(userId);
  }

  async status(userId: string, resource: CatalogResource, externalId: number) {
    return { liked: await this.exists(userId, resource, externalId) };
  }

  async add(userId: string, resource: CatalogResource, externalId: number) {
    await this.assertExternalResourceExists(resource, externalId);

    await this.repository.add(userId, resource, externalId);

    return { liked: true };
  }

  async remove(userId: string, resource: CatalogResource, externalId: number) {
    await this.repository.remove(userId, resource, externalId);

    return { liked: false };
  }

  private async exists(
    userId: string,
    resource: CatalogResource,
    externalId: number,
  ): Promise<boolean> {
    return this.repository.exists(userId, resource, externalId);
  }

  private async assertExternalResourceExists(
    resource: CatalogResource,
    externalId: number,
  ): Promise<void> {
    await this.catalog.getResource(resource, externalId);
  }
}

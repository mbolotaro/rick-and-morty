import { describe, expect, it, vi } from 'vitest';
import { ApplicationError } from '../../../common/errors/application-error.js';
import { CommentsService } from './comments.service.js';
import { CommentsRepository } from './ports/comments-repository.port.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { CommentRecord } from './ports/comments-repository.port.js';

const comment: CommentRecord = {
  id: 'comment-1',
  content: 'Wubba lubba dub dub',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  resource: 'characters',
  externalId: 1,
  author: { id: 'author-1', firstName: 'Morty', lastName: 'Smith' },
  ratings: [
    { userId: 'user-1', value: 'UP' },
    { userId: 'user-2', value: 'DOWN' },
    { userId: 'user-3', value: 'UP' },
  ],
};

function createSut() {
  const repository: CommentsRepository = {
    list: vi.fn().mockResolvedValue([comment]),
    create: vi.fn().mockResolvedValue(comment),
    exists: vi.fn().mockResolvedValue(true),
    toggleRating: vi.fn().mockResolvedValue({ up: 2, down: 1, current: 'UP' }),
  };
  const catalog: CatalogGateway = {
    getCharactersPage: vi.fn(), getCharacter: vi.fn(), getEpisodesPage: vi.fn(), getEpisode: vi.fn(),
    getEpisodes: vi.fn(), getLocationsPage: vi.fn(), getLocation: vi.fn(), getLocations: vi.fn(),
    getResource: vi.fn(),
  };
  return { service: new CommentsService(repository, catalog), repository, catalog };
}

describe('CommentsService', () => {
  it('maps ratings including the current user rating', async () => {
    const { service } = createSut();
    await expect(service.list('user-1', 'characters', 1)).resolves.toEqual([
      expect.objectContaining({ rating: { up: 2, down: 1, current: 'UP' } }),
    ]);
  });

  it('returns no current rating for a user that did not rate the comment', async () => {
    const { service } = createSut();
    await expect(service.list('another-user', 'characters', 1)).resolves.toEqual([
      expect.objectContaining({ rating: { up: 2, down: 1, current: null } }),
    ]);
  });

  it('checks the external resource before persisting a comment', async () => {
    const { service, catalog, repository } = createSut();
    await service.create('user-1', 'characters', 1, { content: comment.content });
    expect(catalog.getResource).toHaveBeenCalledWith('characters', 1);
    expect(repository.create).toHaveBeenCalledWith({
      userId: 'user-1', resource: 'characters', externalId: 1, content: comment.content,
    });
  });

  it('does not persist a comment for an unavailable external resource', async () => {
    const { service, catalog, repository } = createSut();
    vi.mocked(catalog.getResource).mockRejectedValue(new Error('not found'));
    await expect(service.create('user-1', 'episodes', 1, { content: comment.content })).rejects.toThrow('not found');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects rating a comment that does not exist', async () => {
    const { service, repository } = createSut();
    vi.mocked(repository.exists).mockResolvedValue(false);
    await expect(service.rate('user-1', 'missing', { value: 'UP' })).rejects.toBeInstanceOf(ApplicationError);
    expect(repository.toggleRating).not.toHaveBeenCalled();
  });

  it('delegates a valid rating toggle to the repository', async () => {
    const { service, repository } = createSut();
    await expect(service.rate('user-1', comment.id, { value: 'DOWN' })).resolves.toEqual({ up: 2, down: 1, current: 'UP' });
    expect(repository.toggleRating).toHaveBeenCalledWith('user-1', comment.id, 'DOWN');
  });
});

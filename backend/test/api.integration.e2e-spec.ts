import { INestApplication, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../src/modules/auth/application/auth.service.js';
import { AuthController } from '../src/modules/auth/presentation/auth.controller.js';
import { AuthCookieService } from '../src/modules/auth/presentation/auth-cookie.service.js';
import { CharactersService } from '../src/modules/characters/application/characters.service.js';
import { CharactersController } from '../src/modules/characters/presentation/characters.controller.js';
import { CommentsService } from '../src/modules/comments/application/comments.service.js';
import { CommentsController } from '../src/modules/comments/presentation/comments.controller.js';
import { CatalogEpisodesService } from '../src/modules/episodes/application/catalog-episodes.service.js';
import { CatalogEpisodesController } from '../src/modules/episodes/presentation/catalog-episodes.controller.js';
import { FavoritesService } from '../src/modules/favorites/application/favorites.service.js';
import { FavoritesController } from '../src/modules/favorites/presentation/favorites.controller.js';
import { LocationsService } from '../src/modules/locations/application/locations.service.js';
import { LocationsController } from '../src/modules/locations/presentation/locations.controller.js';

const currentUser = {
  sub: 'user-1',
  scope: 'full' as const,
  type: 'access' as const,
};

const publicUser = {
  id: currentUser.sub,
  firstName: 'Rick',
  lastName: 'Sanchez',
  email: 'rick@example.com',
  isEmailVerified: true,
};

class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    context.switchToHttp().getRequest<{ user: typeof currentUser }>().user = currentUser;
    return true;
  }
}

describe('HTTP API integration', () => {
  let app: INestApplication;
  const auth = {
    signUp: vi.fn().mockResolvedValue({ user: publicUser, accessToken: 'access-token', refreshToken: 'refresh-token' }),
    signIn: vi.fn().mockResolvedValue({ user: publicUser, accessToken: 'access-token', refreshToken: 'refresh-token' }),
    refresh: vi.fn().mockResolvedValue({ user: publicUser, accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }),
    signOut: vi.fn(), sessions: vi.fn().mockResolvedValue([]), currentUser: vi.fn().mockResolvedValue(publicUser), revokeSession: vi.fn(),
  };
  const cookies = { set: vi.fn(), clear: vi.fn(), get: vi.fn().mockReturnValue({ refreshToken: 'refresh-token' }) };
  const characters = {
    list: vi.fn().mockResolvedValue({ info: {}, results: [] }), getById: vi.fn().mockResolvedValue({ id: 1 }),
    getProfile: vi.fn().mockResolvedValue({ character: { id: 1 }, episodes: [], locations: [] }),
  };
  const episodes = { list: vi.fn().mockResolvedValue({ info: {}, results: [] }), getById: vi.fn().mockResolvedValue({ id: 1 }) };
  const locations = { list: vi.fn().mockResolvedValue({ info: {}, results: [] }), getById: vi.fn().mockResolvedValue({ id: 1 }) };
  const favorites = {
    list: vi.fn().mockResolvedValue({ characters: [], locations: [], episodes: [] }), status: vi.fn().mockResolvedValue({ liked: false }),
    add: vi.fn().mockResolvedValue({ liked: true }), remove: vi.fn().mockResolvedValue({ liked: false }),
  };
  const comments = {
    list: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({ id: 'comment-1' }),
    rate: vi.fn().mockResolvedValue({ up: 1, down: 0, current: 'UP' }),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [
        AuthController, CharactersController, CatalogEpisodesController, LocationsController,
        FavoritesController, CommentsController,
      ],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: AuthCookieService, useValue: cookies },
        { provide: CharactersService, useValue: characters },
        { provide: CatalogEpisodesService, useValue: episodes },
        { provide: LocationsService, useValue: locations },
        { provide: FavoritesService, useValue: favorites },
        { provide: CommentsService, useValue: comments },
        { provide: APP_GUARD, useClass: TestAuthGuard },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('exposes web and mobile authentication flows', async () => {
    const credentials = { firstName: 'Rick', lastName: 'Sanchez', email: publicUser.email, password: 'Password123' };
    await request(app.getHttpServer()).post('/auth/sign-up').send(credentials).expect(201).expect({ user: publicUser });
    await request(app.getHttpServer()).post('/auth/sign-in').send({ email: publicUser.email, password: 'Password123' }).expect(201).expect({ user: publicUser });
    await request(app.getHttpServer()).post('/auth/mobile/sign-up').send(credentials).expect(201);
    await request(app.getHttpServer()).post('/auth/mobile/sign-in').send({ email: publicUser.email, password: 'Password123' }).expect(201);
    await request(app.getHttpServer()).post('/auth/mobile/refresh').send({ refreshToken: 'refresh-token' }).expect(201);
    await request(app.getHttpServer()).post('/auth/mobile/sign-out').send({ refreshToken: 'refresh-token' }).expect(204);
    await request(app.getHttpServer()).post('/auth/refresh').expect(201).expect({ user: publicUser });
    await request(app.getHttpServer()).post('/auth/sign-out').expect(204);
    expect(cookies.set).toHaveBeenCalled();
    expect(cookies.clear).toHaveBeenCalled();
  });

  it('rejects malformed authentication payloads before their use case executes', async () => {
    const callsBefore = auth.signIn.mock.calls.length;
    await request(app.getHttpServer()).post('/auth/sign-in').send({ email: 'not-an-email' }).expect(400);
    expect(auth.signIn).toHaveBeenCalledTimes(callsBefore);
  });

  it('exposes the authenticated account and session endpoints', async () => {
    await request(app.getHttpServer()).get('/auth/sessions').expect(200).expect([]);
    await request(app.getHttpServer()).get('/auth/me').expect(200).expect(publicUser);
    await request(app.getHttpServer()).delete('/auth/sessions/session-1').expect(204);
    expect(auth.revokeSession).toHaveBeenCalledWith(currentUser.sub, 'session-1');
  });

  it('routes every catalog list, detail and character profile request', async () => {
    await request(app.getHttpServer()).get('/characters?page=2&status=alive').expect(200);
    await request(app.getHttpServer()).get('/characters/1').expect(200).expect({ id: 1 });
    await request(app.getHttpServer()).get('/characters/1/profile').expect(200).expect({ character: { id: 1 }, episodes: [], locations: [] });
    await request(app.getHttpServer()).get('/episodes?page=2&episode=S01E01').expect(200);
    await request(app.getHttpServer()).get('/episodes/1').expect(200).expect({ id: 1 });
    await request(app.getHttpServer()).get('/locations?page=2&dimension=Dimension%20C-137').expect(200);
    await request(app.getHttpServer()).get('/locations/1').expect(200).expect({ id: 1 });
    expect(characters.list).toHaveBeenCalledWith({ page: 2, status: 'alive' });
    expect(episodes.list).toHaveBeenCalledWith({ page: 2, episode: 'S01E01' });
    expect(locations.list).toHaveBeenCalledWith({ page: 2, dimension: 'Dimension C-137' });
  });

  it('rejects invalid enumerated catalog filters and invalid resource ids', async () => {
    await request(app.getHttpServer()).get('/characters?status=anything').expect(400);
    await request(app.getHttpServer()).get('/episodes/not-a-number').expect(400);
  });

  it('routes every favorite operation with the authenticated user', async () => {
    await request(app.getHttpServer()).get('/favorites').expect(200);
    await request(app.getHttpServer()).get('/favorites/characters/1').expect(200).expect({ liked: false });
    await request(app.getHttpServer()).put('/favorites/episodes/1').expect(200).expect({ liked: true });
    await request(app.getHttpServer()).delete('/favorites/locations/1').expect(200).expect({ liked: false });
    expect(favorites.status).toHaveBeenCalledWith(currentUser.sub, 'characters', 1);
    expect(favorites.add).toHaveBeenCalledWith(currentUser.sub, 'episodes', 1);
    expect(favorites.remove).toHaveBeenCalledWith(currentUser.sub, 'locations', 1);
  });

  it('validates favorite resource parameters', async () => {
    await request(app.getHttpServer()).put('/favorites/invalid/1').expect(400);
    await request(app.getHttpServer()).put('/favorites/characters/0').expect(400);
  });

  it('routes comments and rating operations with validated payloads', async () => {
    await request(app.getHttpServer()).get('/comments/characters/1').expect(200).expect([]);
    await request(app.getHttpServer()).post('/comments/characters/1').send({ content: 'A great character.' }).expect(201).expect({ id: 'comment-1' });
    await request(app.getHttpServer()).put('/comments/comment-1/rating').send({ value: 'UP' }).expect(200).expect({ up: 1, down: 0, current: 'UP' });
    expect(comments.list).toHaveBeenCalledWith(currentUser.sub, 'characters', 1);
    expect(comments.create).toHaveBeenCalledWith(currentUser.sub, 'characters', 1, { content: 'A great character.' });
    expect(comments.rate).toHaveBeenCalledWith(currentUser.sub, 'comment-1', { value: 'UP' });
  });

  it('enforces comment and rating input constraints', async () => {
    await request(app.getHttpServer()).post('/comments/episodes/1').send({ content: '' }).expect(400);
    await request(app.getHttpServer()).put('/comments/comment-1/rating').send({ value: 'MAYBE' }).expect(400);
    await request(app.getHttpServer()).get('/comments/invalid/1').expect(400);
  });
});

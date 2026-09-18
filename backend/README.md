# PickleVerso API

Backend NestJS do PickleVerso, com PostgreSQL, Prisma, autenticação por cookies HTTP-only, catálogo, favoritos, comentários e Swagger.

## Executar localmente

```bash
cp .env.example .env
npm install
docker compose up -d
npm run prisma:generate
npx prisma migrate deploy
npm run start:dev
```

No PowerShell, substitua o primeiro comando por:

```powershell
Copy-Item .env.example .env
```

- API: `http://localhost:3040`
- Swagger: `http://localhost:3040/docs`
- OpenAPI JSON: `http://localhost:3040/docs-json`

## Testes

```bash
# Testes unitários
npm run test

# Integração HTTP de todas as rotas, com dependências de infraestrutura isoladas
npm run test:e2e

# Ambas as suítes
npm run test:all

# Relatório de cobertura unitária
npm run test:cov
```

Os testes de integração usam um módulo Nest isolado e dublês para banco e API externa; eles não criam, leem ou apagam dados do PostgreSQL local.

Consulte o [README principal](../README.md) para a configuração completa do backend e do frontend.

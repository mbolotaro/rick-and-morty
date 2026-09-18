# PickleVerso API

Backend NestJS do PickleVerso, com PostgreSQL, Prisma, autenticação por cookies HTTP-only, catálogo, favoritos, comentários e Swagger.

## Executar localmente

```bash
cp .env.example .env
npm install --legacy-peer-deps
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

Consulte o [README principal](../README.md) para a configuração completa do backend e do frontend.

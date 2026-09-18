# PickleVerso

Aplicação web inspirada em Rick and Morty, com catálogo de personagens, episódios e localidades, autenticação com rotação de refresh tokens, favoritos, comentários e avaliações.

## Estrutura

- `backend`: API NestJS, Prisma, PostgreSQL, Zod e Swagger.
- `frontend`: aplicação Next.js com renderização no servidor, React Query e next-intl.

## Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- Docker Desktop, para executar o PostgreSQL localmente.

## 1. Backend e banco de dados

Entre na pasta do backend:

```bash
cd backend
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Revise principalmente `JWT_SECRET`, `DB_*` e `CORS_ORIGIN`. Depois instale as dependências:

```bash
npm install --legacy-peer-deps
```

Inicie o PostgreSQL:

```bash
docker compose up -d
```

Gere o Prisma Client e aplique as migrações existentes:

```bash
npm run prisma:generate
npx prisma migrate deploy
```

Inicie a API em modo de desenvolvimento:

```bash
npm run start:dev
```

A API estará em `http://localhost:3040`.

### Swagger

Com o backend em execução:

- Interface Swagger: `http://localhost:3040/docs`
- Documento OpenAPI JSON: `http://localhost:3040/docs-json`

## 2. Frontend

Em outro terminal, partindo da raiz do projeto:

```bash
cd frontend
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Instale as dependências e inicie o Next.js:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. O valor de `BACKEND_URL` deve apontar para `http://localhost:3040`.

## Validação antes de enviar alterações

Backend:

```bash
cd backend
npm run lint
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Comandos úteis

Parar o PostgreSQL sem apagar os dados:

```bash
cd backend
docker compose down
```

Criar uma nova migração durante o desenvolvimento:

```bash
cd backend
npm run prisma:migrate -- --name nome_da_migracao
```

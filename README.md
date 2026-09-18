# PickleVerso

Aplicação inspirada em Rick and Morty, com catálogo de personagens, episódios e localidades, autenticação com rotação de refresh tokens, favoritos, comentários e avaliações.

## Estrutura

- `backend`: API NestJS, Prisma, PostgreSQL, Zod e Swagger.
- `frontend`: aplicação Next.js com renderização no servidor, React Query e next-intl.
- `mobile`: aplicativo Flutter para Android e iOS.

## Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- Docker Desktop, para executar o PostgreSQL localmente.
- Flutter e o SDK da plataforma desejada, para compilar o aplicativo mobile.

## Executar o projeto compilado

Os comandos abaixo executam backend e frontend a partir dos respectivos builds de produção. Abra um terminal separado para o banco, para a API e para o frontend.

### 1. Banco de dados e backend

Entre na pasta do backend e crie o arquivo de ambiente:

```bash
cd backend
cp .env.example .env
```

No PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

Revise principalmente `JWT_SECRET`, `DB_*` e `CORS_ORIGIN`. Depois, instale as dependências, suba o PostgreSQL e prepare o banco:

```bash
npm ci --legacy-peer-deps
docker compose up -d
npm run prisma:generate
npx prisma migrate deploy
```

Compile e execute a API em modo de produção:

```bash
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3040`.

Com o backend em execução:

- Swagger: `http://localhost:3040/docs`
- OpenAPI JSON: `http://localhost:3040/docs-json`

### 2. Frontend

Em outro terminal, partindo da raiz do projeto, crie o arquivo de ambiente:

```bash
cd frontend
cp .env.example .env.local
```

No PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env.local
```

Confirme que `BACKEND_URL` aponta para a API e, então, instale, compile e execute o frontend:

```bash
npm ci
npm run build
npm run start
```

Abra `http://localhost:3000`.

### 3. Mobile

Entre na pasta do aplicativo, instale as dependências e crie sua configuração de build:

```bash
cd mobile
flutter pub get
cp .env.example .env
```

No PowerShell, substitua o último comando por:

```powershell
Copy-Item .env.example .env
```

Configure no `mobile/.env` uma URL da API que possa ser acessada pelo aparelho:

```dotenv
API_BASE_URL=https://api.seu-dominio.com
```

Em uma rede local, também pode ser utilizado o endereço IP do computador, desde que o backend e a porta estejam acessíveis:

```dotenv
API_BASE_URL=http://192.168.0.10:3040
```

Gere o APK Android em modo release:

```bash
flutter build apk --release --dart-define-from-file=.env
```

O arquivo será criado em `mobile/build/app/outputs/flutter-apk/app-release.apk` e poderá ser instalado em um aparelho Android.

Para publicação na Play Store, gere um Android App Bundle:

```bash
flutter build appbundle --release --dart-define-from-file=.env
```

Para iOS, em um ambiente macOS com Xcode configurado:

```bash
flutter build ipa --release --dart-define-from-file=.env
```

> O `.env` mobile é incorporado ao build e não deve conter senhas, tokens ou chaves privadas. Antes de publicar o aplicativo, configure as assinaturas de produção do Android e do iOS.

## Verificações de qualidade

Backend:

```bash
cd backend
npm run lint
npm run test:all
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Mobile:

```bash
cd mobile
flutter analyze
flutter test
flutter build apk --release --dart-define-from-file=.env
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

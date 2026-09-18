# PickleVerso

Aplicação web inspirada em Rick and Morty, com catálogo de personagens, episódios e localidades, autenticação com rotação de refresh tokens, favoritos, comentários e avaliações.

## Estrutura

- `backend`: API NestJS, Prisma, PostgreSQL, Zod e Swagger.
- `frontend`: aplicação Next.js com renderização no servidor, React Query e next-intl.
- `mobile`: aplicativo Flutter para Android, iOS e demais plataformas suportadas.

## Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- Docker Desktop, para executar o PostgreSQL localmente.
- Flutter e Android SDK, para compilar e instalar o aplicativo mobile.

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

## 3. Mobile Android em modo release

O modo release gera um APK compilado que pode ser aberto normalmente pelo ícone do aplicativo, sem manter `flutter run` em execução.

Entre na pasta do mobile, instale as dependências e crie o arquivo local de ambiente:

```powershell
cd mobile
flutter pub get
Copy-Item .env.example .env
```

### Backend local acessado por USB

Para um Android físico conectado por USB, utilize no arquivo `mobile/.env`:

```dotenv
API_BASE_URL=http://127.0.0.1:3040
```

Com o backend executando na porta `3040`, redirecione a porta do aparelho:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:3040 tcp:3040
```

Gere o APK release:

```powershell
flutter build apk --release --dart-define-from-file=.env
```

Instale o APK no aparelho:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r build\app\outputs\flutter-apk\app-release.apk
```

Depois da instalação, o PickleVerso pode ser aberto diretamente pelo ícone. Enquanto `API_BASE_URL` estiver apontando para `127.0.0.1`, o cabo e o redirecionamento com `adb reverse` continuam necessários para acessar o backend do computador. O redirecionamento deve ser refeito quando o aparelho ou o serviço ADB for reiniciado.

### Executar sem depender do cabo

Para usar o aplicativo sem USB, o backend precisa estar publicado em HTTPS ou disponível na mesma rede do aparelho. Nesse caso, altere o `.env` antes de gerar o APK:

```dotenv
API_BASE_URL=https://api.seu-dominio.com
```

Para desenvolvimento na mesma rede Wi-Fi também é possível usar o IP local do computador, por exemplo `http://192.168.0.10:3040`, desde que a porta esteja liberada no firewall e o backend aceite conexões externas.

> O `.env` mobile é uma configuração de build, não um cofre de segredos. Nunca armazene senhas, tokens ou chaves privadas nele. Atualmente o build release local usa a chave de debug; antes de publicar na Play Store, configure uma chave de assinatura própria.

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

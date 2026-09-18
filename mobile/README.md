# PickleVerso Mobile

Aplicativo Flutter do PickleVerso com autenticação mobile, refresh token rotativo e catálogo paginado.

## Funcionalidades

- Login e cadastro com tokens rotativos armazenados com segurança.
- Catálogo paginado de personagens, episódios e localidades.
- Filtros tipados compatíveis com os valores aceitos pelo backend.
- Detalhes de personagens com episódios e localidades relacionados.
- Favoritos, comentários com limite de 1000 caracteres e avaliações positivas ou negativas.
- Tratamento centralizado de erros HTTP e renovação automática da sessão.

## Configuração do build

Instale as dependências e crie a configuração local:

```bash
flutter pub get
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Defina uma URL da API acessível pelo aparelho:

```dotenv
API_BASE_URL=https://api.seu-dominio.com
```

Para testes em uma rede local, também pode ser utilizado o IP do computador:

```dotenv
API_BASE_URL=http://192.168.0.10:3040
```

O backend deve aceitar conexões externas e a porta utilizada precisa estar liberada na rede.

## Android release

Gere o APK instalável:

```bash
flutter build apk --release --dart-define-from-file=.env
```

O artefato será gerado em:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Para publicação na Play Store, gere o Android App Bundle:

```bash
flutter build appbundle --release --dart-define-from-file=.env
```

O artefato será gerado em:

```text
build/app/outputs/bundle/release/app-release.aab
```

## iOS release

Em um ambiente macOS com Xcode configurado, gere o arquivo de distribuição:

```bash
flutter build ipa --release --dart-define-from-file=.env
```

## Qualidade

```bash
flutter analyze
flutter test
flutter build apk --release --dart-define-from-file=.env
```

## Organização

- `lib/app`: inicialização e rotas protegidas.
- `lib/core`: configuração, rede, armazenamento seguro, tema e componentes compartilhados.
- `lib/features`: funcionalidades isoladas em `data`, `domain` e `presentation`.
- `test`: testes unitários das fronteiras de dados e da segurança da sessão.

O access token permanece apenas em memória. O refresh token é salvo pelo `flutter_secure_storage`, que utiliza o armazenamento seguro disponibilizado por cada sistema operacional.

O arquivo `.env` é incorporado ao aplicativo durante a compilação e não deve conter segredos. Antes de publicar, configure uma assinatura própria para cada plataforma.

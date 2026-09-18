# PickleVerso Mobile

Aplicativo Flutter do PickleVerso com autenticação mobile, refresh token rotativo e catálogo paginado.

## Funcionalidades

- Login e cadastro com tokens rotativos armazenados com segurança.
- Catálogo paginado de personagens, episódios e localidades.
- Filtros tipados compatíveis com os valores aceitos pelo backend.
- Detalhes de personagens com episódios e localidades relacionados.
- Favoritos, comentários com limite de 1000 caracteres e avaliações positivas/negativas.
- Tratamento centralizado de erros HTTP e renovação automática da sessão.

## Configuração

Instale as dependências:

```bash
flutter pub get
```

Crie a configuração local a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

O Flutter lê esse arquivo em tempo de compilação. Para um Android físico conectado por USB, use:

```dotenv
API_BASE_URL=http://127.0.0.1:3040
```

## Gerar e instalar o APK release

Com o backend em execução na porta `3040`, configure o redirecionamento USB:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:3040 tcp:3040
```

Gere o APK compilado em modo release:

```powershell
flutter build apk --release --dart-define-from-file=.env
```

O artefato será gerado em:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Instale-o no aparelho:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r build\app\outputs\flutter-apk\app-release.apk
```

Depois disso, abra o PickleVerso pelo ícone do aplicativo. Não é necessário manter `flutter run` aberto. O cabo continua necessário apenas porque o backend local está sendo acessado por `127.0.0.1` através do `adb reverse`.

## Executar sem cabo

Utilize no `.env` um backend publicado em HTTPS:

```dotenv
API_BASE_URL=https://api.seu-dominio.com
```

Também é possível usar o IP local do computador quando ambos estiverem na mesma rede Wi-Fi:

```dotenv
API_BASE_URL=http://192.168.0.10:3040
```

O backend deve aceitar conexões externas e a porta `3040` precisa estar liberada no firewall.

## Desenvolvimento

Para usar hot reload durante o desenvolvimento:

```powershell
flutter run --dart-define-from-file=.env
```

Para o Android Emulator, use `API_BASE_URL=http://10.0.2.2:3040`. No iOS Simulator, use `API_BASE_URL=http://127.0.0.1:3040`.

## Qualidade

```bash
flutter analyze
flutter test
flutter build apk --release --dart-define-from-file=.env
```

## Organização

- `lib/app`: inicialização e rotas protegidas.
- `lib/core`: configuração, rede, armazenamento seguro, tema e componentes compartilhados.
- `lib/features`: features isoladas em `data`, `domain` e `presentation`.
- `test`: testes unitários das fronteiras de dados e segurança da sessão.

O access token permanece apenas em memória. O refresh token é salvo pelo `flutter_secure_storage`, que utiliza o armazenamento seguro disponibilizado por cada sistema operacional.

O arquivo `.env` não deve conter segredos. Antes de publicar o aplicativo, substitua a assinatura de debug configurada no build release por uma chave de assinatura própria.

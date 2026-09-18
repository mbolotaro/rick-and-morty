# PickleVerso Mobile

Aplicativo Flutter do PickleVerso com autenticação mobile, refresh token rotativo e catálogo paginado.

## Funcionalidades

- Login e cadastro com tokens rotativos armazenados com segurança.
- Catálogo paginado de personagens, episódios e localidades.
- Filtros tipados compatíveis com os valores aceitos pelo backend.
- Detalhes de personagens com episódios e localidades relacionados.
- Favoritos, comentários com limite de 1000 caracteres e avaliações positivas/negativas.
- Tratamento centralizado de erros HTTP e renovação automática da sessão.

## Executar

Instale as dependências:

```bash
flutter pub get
```

Crie a configuração local a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

O Flutter lê esse arquivo em tempo de compilação. Execute o aplicativo com:

```bash
flutter run --dart-define-from-file=.env
```

Em um Android físico na mesma rede Wi-Fi do computador, informe no `.env` o IP local da máquina que executa o backend:

```dotenv
API_BASE_URL=http://192.168.0.10:3040
```

Para usar exclusivamente a conexão USB, redirecione a porta antes de iniciar o aplicativo:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:3040 tcp:3040
flutter run --dart-define-from-file=.env
```

Nesse caso, use `API_BASE_URL=http://127.0.0.1:3040` no `.env`. O redirecionamento precisa ser refeito depois que o aparelho for desconectado ou reiniciado. Mudanças no arquivo exigem reiniciar a execução; hot reload não recompila `String.fromEnvironment`.

Para o Android Emulator, use `API_BASE_URL=http://10.0.2.2:3040`. No iOS Simulator, use `API_BASE_URL=http://127.0.0.1:3040`.

## Qualidade

```bash
flutter analyze
flutter test
flutter build apk --debug
```

## Organização

- `lib/app`: inicialização e rotas protegidas.
- `lib/core`: configuração, rede, armazenamento seguro, tema e componentes compartilhados.
- `lib/features`: features isoladas em `data`, `domain` e `presentation`.
- `test`: testes unitários das fronteiras de dados e segurança da sessão.

O access token permanece apenas em memória. O refresh token é salvo pelo `flutter_secure_storage`, que utiliza o armazenamento seguro disponibilizado por cada sistema operacional.

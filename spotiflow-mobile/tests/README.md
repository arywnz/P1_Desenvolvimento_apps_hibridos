# Persistencia local

Executar na pasta spotiflow-mobile com Node 22 ou superior:

```sh
node --test tests/*.cjs
npx tsc --noEmit
npx expo lint
npx expo export --platform web
```

Os testes usam adaptadores em memoria para AsyncStorage e SecureStore, e o
SQLite real do Node para validar SQL, isolamento por usuario e ordenacao.
Nao substituem testes dos modulos nativos em Android/iOS.

Verificacao no dispositivo:

- Alternar tema, fechar o aplicativo e abrir novamente.
- Entrar via API, reiniciar e verificar que o login nao aparece durante o boot.
- Sair, reiniciar e verificar que a sessao nao retorna.
- Abrir o catalogo online, ativar modo aviao e reabrir o aplicativo.
- Reconectar e conferir atualizacao do catalogo e da pesquisa atual.
- Criar playlist, reproduzir faixas e reiniciar para conferir biblioteca e Recentes.
- Entrar com outra conta e conferir isolamento das playlists e historico.

SecureStore usa Keychain/Keystore no dispositivo. Na web, o token fica somente
em memoria; sessoes de API exigem novo login apos recarregar a pagina.
O cache guarda metadados do catalogo, nao baixa audio para reproducao offline.

SQLite web requer isolamento entre origens. O Metro local configura
Cross-Origin-Opener-Policy: same-origin e
Cross-Origin-Embedder-Policy: credentialless.
O servidor que hospedar a exportacao web tambem deve fornecer esses cabecalhos.

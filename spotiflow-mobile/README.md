# Spotiflow Mobile

Aplicativo hibrido feito em Expo Router, inspirado no fluxo visual do Spotify. O projeto usa dados mockados, navegacao por abas, rotas dinamicas e estado global de player.

## Como rodar

```bash
npm install
npx expo start
```

Depois, abrir no Expo Go, emulador Android/iOS ou navegador.

## Navegacao principal

- Inicio: feed com filtros, atalhos, tocadas recentemente, DJ personalizado e mixes recomendados.
- Buscar: barra de pesquisa, estado local e categorias coloridas.
- Sua Biblioteca: filtros, ordenacao, playlists e atalho de criacao.
- Criar: modal/bottom sheet com opcoes de playlist, match e jam.
- Playlist: tela dinamica com capa, play, lista de faixas e acoes.
- Player: modal em tela cheia com capa, progresso e controles.
- Perfil: amigos ativos, mensagens e informacoes da conta.
- Configuracoes: switches de reproducao, economia de dados e privacidade.
- Chat: conversa direta com envio de mensagens e card de musica compartilhada.
- Perfil do amigo: atividade atual e playlists exclusivas de cada amigo.

## Interacoes importantes

- Tocar na foto de perfil na Home ou na Biblioteca abre Configuracoes.
- Dentro de Configuracoes, a opcao "Perfil do usuario" abre a tela de Perfil.
- Tocar em playlists abre a rota dinamica de detalhes.
- Tocar em faixas ou cards de musica atualiza o player global.
- Tocar em amigos abre o perfil do amigo com playlists proprias.

## Requisitos atendidos

- Mais de 6 telas navegaveis.
- Mais de 20 commits no historico.
- Projeto Expo limpo, com `node_modules/` protegido pelo `.gitignore`.
- Dados mockados com nomes realistas e playlists diferentes por usuario.

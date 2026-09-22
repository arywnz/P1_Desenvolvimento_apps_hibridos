# Spotiflow Mobile - Avaliação P1

> **Disciplina:** Desenvolvimento de Aplicativos Híbridos
> **Professor:** Márcio Garrido
> **Instituição:** Universidade de Vassouras 
> **Integrantes:** Ian Shtorache e João Victor 
> **Tecnologias:** React Native, Expo Router (SDK 57) e TypeScript

---

## Telas do Sistema

### 1. Sua Biblioteca

`src/app/(tabs)/library.tsx`

A tela **Sua Biblioteca** reune as playlists e conteúdos salvos pelo usuário. Ela permite filtrar e organizar os itens da biblioteca, além de acessar as playlists cadastradas.

Também possui o **Mini Player**, que mantém a música atual disponível durante a navegação, e a barra inferior para acesso às principais áreas do aplicativo.

<p align="center">
  <img src="docs/screenshots/01-biblioteca.jpg" alt="Tela da Biblioteca" width="300" />
</p>

---

### 2. Modal de Criação

`src/app/create-modal.tsx`

O **Modal de Criação** é aberto pelo botão **Criar (+)** e apresenta as opções disponíveis para criação de conteúdo no aplicativo.

Por meio dele, o usuário pode iniciar a criação de uma playlist, playlist colaborativa, playlist mixada, Match ou Jam.

<p align="center">
  <img src="docs/screenshots/02-modal-criar.jpg" alt="Modal de Criação" width="300" />
</p>

---

### 3. Perfil do Usuário

`src/app/profile.tsx`

A tela de **Perfil** exibe as informações da conta do usuário e fornece acesso às principais opções relacionadas ao perfil.

Também apresenta a atividade dos amigos, mostrando o que cada usuário está ouvindo, além de permitir o acesso aos perfis e playlists desses contatos.

<p align="center">
  <img src="docs/screenshots/03-perfil-amigos.jpg" alt="Perfil do Usuário" width="300" />
</p>

---

### 4. Configurações e Privacidade

`src/app/settings.tsx`

A tela de **Configurações e Privacidade** permite alterar preferências do aplicativo.

Nela, o usuário pode configurar opções relacionadas à conta, economia de dados, reprodução, modo offline, transição entre faixas, volume e exibição de conteúdo explícito.

<p align="center">
  <img src="docs/screenshots/04-configuracoes.jpg" alt="Configurações e Privacidade" width="300" />
</p>

---

### 5. Seu Premium

`src/app/account.tsx`

A tela **Premium** apresenta as informações da assinatura do usuário, como plano ativo, valor da mensalidade, data de cobrança e método de pagamento.

<p align="center">
  <img src="docs/screenshots/05-seu-premium.jpg" alt="Seu Premium" width="300" />
</p>

---

### 6. Tocadas Recentemente

`src/app/account.tsx?type=recent`

A tela **Tocadas Recentemente** apresenta o histórico de reprodução do usuário, permitindo acessar novamente músicas e playlists ouvidas anteriormente.

<p align="center">
  <img src="docs/screenshots/06-tocadas-recentemente.jpg" alt="Tocadas Recentemente" width="300" />
</p>

---

### 7. Estatísticas Musicais

`src/app/account.tsx?type=stats`

A tela de **Estatísticas Musicais** apresenta dados sobre os hábitos de reprodução do usuário, como artista mais ouvido, gênero predominante, quantidade de músicas reproduzidas e tempo total de reprodução.

<p align="center">
  <img src="docs/screenshots/07-estatisticas-musicais.jpg" alt="Estatísticas Musicais" width="300" />
</p>

---

## Outras Telas do Aplicativo

Além das telas apresentadas acima, o aplicativo também possui outras telas e funcionalidades, como **Tela Inicial, Busca, Detalhes de Playlist, Player, Chat e Perfil de Amigos**.

<div align="center" id="short-description-and-logo">

<h1>Game Deal</h1>

Saiba quando o preço de um jogo cair.

</div>

<div align="center" id="badges">

[![Backend CI](https://img.shields.io/github/actions/workflow/status/JorgeLNJUnior/GameDeal/frontend.yml?branch=main&label=Backend+CI)](https://github.com/JorgeLNJunior/GameDeal/actions/workflows/backend.yml)
[![Frontend CI](https://img.shields.io/github/actions/workflow/status/JorgeLNJUnior/GameDeal/frontend.yml?branch=main&label=Frontend+CI)](https://github.com/JorgeLNJunior/GameDeal/actions/workflows/frontend.yml)
[![Coverage Status](https://coveralls.io/repos/github/JorgeLNJunior/GameDeal/badge.svg?branch=main)](https://coveralls.io/github/JorgeLNJunior/GameDeal?branch=main)
[![License](https://img.shields.io/github/license/JorgeLNJunior/GameDeal)](https://github.com/JorgeLNJunior/GameDeal/blob/main/LICENSE.md)

</div>

<div align="center" id="links">

[APP](https://app.gamedeal.cloudns.app) |
[API](https://api.gamedeal.cloudns.nz) |
[Trello](https://trello.com/b/LZk67XmB)

</div>

## Tabela de Conteúdos

- [Descrição](https://github.com/JorgeLNJunior/GameDeal#descri%C3%A7%C3%A3o)
- [Configuração](https://github.com/JorgeLNJunior/GameDeal#configura%C3%A7%C3%A3o)
- [Licença](https://github.com/JorgeLNJunior/GameDeal#licen%C3%A7a)

## Descrição
Game Deal consiste de um web scrapper que coleta o preço de vários jogos do Steam e Nuuvem diariamente e envia notificações a cada queda de preço. Os dados coletados formam um histórico de preços que pode ser acessado por meio de uma API REST ou APP Frontend.

Os scrapers e notificador rodam em filas que usam Redis e BullMQ por baixo, enquanto a API é construída com Fastify e o Frontend com VueJS e TailwindCSS.

## Configuração

### Requisitos
- Gerenciador de pacotes [pnpm](https://pnpm.io/installation).
- [Docker](https://docs.docker.com/engine/install/ubuntu/) e [Compose plugin](https://docs.docker.com/compose/install/linux/#install-using-the-repository) ou:
  - Um banco de Dados MySQL para armazenamento.
  - Um banco de Dados Redis para fila e cache.
- Um Token de Bot do [Telegram](https://t.me/botfather).
- O [ID do chat](https://www.alphr.com/find-chat-id-telegram) onde as notificações serão enviadas.

### Instalação
- Clone o projeto para sua máquina `git clone https://github.com/JorgeLNJunior/GameDeal.git`.
- Instale as dependências `pnpm i`.
- Renomeie os arquivos `.env.example` para `.env` dentro de cada diretório dentro de /apps.
- Execute `pnpm docker:up` para subir os container de MySQL, Redis e Redis UI.
- Execute `pnpm start:watch` para iniciar todas as aplicações e `pnpm test` para executar os testes. Os comandos podem ser executados somente em um workspace usando `pnpm start:workspace:watch`, por exemplo, `pnpm start:backend:watch`.

## Licença

Projeto sob a licença [MIT »](https://github.com/JorgeLNJunior/GameDeal/blob/main/LICENSE.md).


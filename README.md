# AI-RPG (Front-end)

Este repositório contém o front-end do projeto AI-RPG — um assistente / Mestre de Masmorras alimentado por LLMs. Ele foi desenvolvido em Angular (TypeScript) e foi pensado para ser usado em conjunto com o back-end do projeto: https://github.com/vitorhugo-dev-1/AI-dungeon-master-back

## Visão geral

Funcionalidades principais:

- Cadastro e login de usuários
- Criação automática de personagens, histórias e campanhas
- Fluxos adaptativos com base nas escolhas do jogador
- Comunicação em tempo real via WebSocket (integração com backend)

## Requisitos

- Node.js (recomendado 14.x ou superior)
- npm (vem com Node.js)
- Backend do projeto em execução para autenticação e WebSocket (veja link acima)

## Instalação

1. Clone o repositório:

```powershell
git clone https://github.com/vitorhugo-dev-1/AI-dungeon-master-front.git .
```

2. Instale as dependências:

```powershell
npm install
```

## Como rodar (desenvolvimento)

No PowerShell, inicie a aplicação:

```powershell
npm start
```

Ou use o CLI do Angular:

```powershell
ng serve
```

Caso não tenha ele instalado:

```powershell
npm install -g @angular/cli
```

Por padrão o servidor de desenvolvimento do Angular (`ng serve`) costuma expor a aplicação em `http://localhost:4200`. Verifique a saída do terminal caso a porta seja diferente.


## Estrutura do projeto (resumo)

Principais arquivos e diretórios:

- `src/` — código-fonte do front-end
  - `app/` — componentes, rotas e serviços do app
    - `app.ts`, `app.routes.ts`, `app.config.ts` — bootstrap e configuração
    - `auth-guard.ts` — guarda de rotas autenticadas
    - `login/` — UI de autenticação e assets (imagens, fontes)
    - `rpg-hub/` — tela principal do jogo) e `creation-dialog/` para criação de personagens
    - `dialog/` — componentes modais reutilizáveis
    - `services/` — serviços: `auth.ts`, `campaign.ts`, `character.ts`, `websocket.ts`
- `src/environment.ts` — arquivo de configuração de ambiente


## Configuração do backend e WebSocket

Este front espera endpoints HTTP para autenticação e recursos (campanhas, personagens) e um servidor WebSocket para comunicação em tempo real. Ajuste os endpoints no arquivo `src/enviroment.ts` para apontar para seu backend.

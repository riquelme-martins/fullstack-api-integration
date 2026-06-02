# Full Stack API Integration

Projeto academico full stack para demonstrar a comunicacao entre front-end e back-end usando JavaScript, Node.js e retorno em JSON.

## Funcionalidades

- Interface responsiva com status da API
- Formulario para envio do nome do usuario
- Requisicao HTTP com `fetch`
- Endpoint `/api/saudacao` retornando JSON
- Tratamento visual para API online/offline
- Visualizacao da resposta JSON na tela

## Tecnologias

- HTML
- CSS
- JavaScript
- Node.js

## Como executar pelo servidor Node.js

Abra a pasta do projeto no terminal e rode:

```bash
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## Como testar pelo Live Server

1. Rode o back-end primeiro:

```bash
npm start
```

2. Depois abra `public/index.html` com Live Server.

Mesmo no Live Server, o front-end chama a API em:

```text
http://localhost:3000
```

## Como abrir com dois cliques no Windows

Execute o arquivo:

```text
abrir-projeto.bat
```

Ele inicia o servidor Node.js e abre o navegador em `http://localhost:3000`.

## Rotas da API

```text
GET /api/status
GET /api/saudacao?nome=Riquelme
```

Exemplo de resposta:

```json
{
  "mensagem": "Ola, Riquelme! Seja bem-vindo(a) a aplicacao Full Stack."
}
```

## Observacao importante

Se aparecer `API offline` ou `Failed to fetch`, o front-end abriu, mas o back-end Node.js nao esta rodando. Execute `npm start` antes de enviar o formulario.

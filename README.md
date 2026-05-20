# Pratica Full Stack e Versionamento

Projeto academico para demonstrar a comunicacao entre front-end e back-end usando HTML, CSS, JavaScript e Node.js.

## Funcionalidades

- Pagina HTML com formulario para digitar o nome do usuario.
- Requisicao HTTP feita pelo JavaScript do navegador.
- Rota `GET /api/saudacao` no servidor Node.js.
- Resposta JSON com saudacao personalizada.
- Historico Git com uso de branch de feature e branch de hotfix.

## Como executar

1. Instale o Node.js.
2. No terminal, acesse a pasta do projeto.
3. Execute:

```bash
npm start
```

4. Abra no navegador:

```text
http://localhost:3000
```

## Rotas

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/` | Exibe a interface da aplicacao. |
| GET | `/api/saudacao?nome=SeuNome` | Retorna uma saudacao personalizada em JSON. |

## Fluxo de versionamento utilizado

- `main`: branch principal do projeto.
- `feature/interface-saudacao`: branch usada para criar a interface e integrar com o servidor.
- `hotfix/validacao-nome`: branch usada para corrigir a validacao de nome vazio.

## Autor

Riquelme

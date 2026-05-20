const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": contentTypes[".json"] });
  response.end(JSON.stringify(data));
}

function serveStaticFile(response, filePath) {
  const extension = path.extname(filePath);
  const contentType = contentTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, 404, { erro: "Arquivo nao encontrado." });
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  });
}

function handleGreeting(request, response, url) {
  const name = (url.searchParams.get("nome") || "").trim();

  if (!name) {
    sendJson(response, 400, {
      erro: "Informe um nome para receber a saudacao."
    });
    return;
  }

  if (name.length > 60) {
    sendJson(response, 400, {
      erro: "O nome deve ter no maximo 60 caracteres."
    });
    return;
  }

  sendJson(response, 200, {
    mensagem: `Ola, ${name}! Seja bem-vindo(a) a aplicacao Full Stack.`
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/api/saudacao") {
    handleGreeting(request, response, url);
    return;
  }

  if (request.method === "GET") {
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(publicDir, safePath);

    serveStaticFile(response, filePath);
    return;
  }

  sendJson(response, 405, { erro: "Metodo nao permitido." });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

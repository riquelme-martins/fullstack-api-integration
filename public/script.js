const form = document.querySelector("#greeting-form");
const nameInput = document.querySelector("#name");
const result = document.querySelector("#result");
const submitButton = document.querySelector("#submit-button");
const checkApiButton = document.querySelector("#check-api");
const apiStatus = document.querySelector("#api-status");
const apiUrl = document.querySelector("#api-url");
const apiDot = document.querySelector("#api-dot");
const routePreview = document.querySelector("#route-preview");
const jsonOutput = document.querySelector("#json-output");

const API_PORT = "3000";

function getApiBaseUrl() {
  const { protocol, hostname, port, origin } = window.location;

  if (protocol === "file:") {
    return `http://localhost:${API_PORT}`;
  }

  if (port === API_PORT) {
    return origin;
  }

  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return `http://localhost:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

const apiBaseUrl = getApiBaseUrl();

function setApiStatus(status, message) {
  apiDot.className = `status-dot ${status}`;
  apiStatus.textContent = message;
  apiUrl.textContent = `Endpoint: ${apiBaseUrl}`;
}

function showResult(message, type = "info") {
  result.className = `result ${type}`;
  result.textContent = message;
}

function showJson(data) {
  jsonOutput.textContent = JSON.stringify(data, null, 2);
}

function buildGreetingEndpoint(name) {
  return `${apiBaseUrl}/api/saudacao?nome=${encodeURIComponent(name)}`;
}

function updateRoutePreview() {
  const name = nameInput.value.trim() || "...";
  routePreview.textContent = `/api/saudacao?nome=${encodeURIComponent(name)}`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("A API nao retornou JSON. Abra o projeto por http://localhost:3000 ou rode npm start.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Nao foi possivel concluir a requisicao.");
  }

  return data;
}

async function checkApiStatus() {
  setApiStatus("checking", "Verificando API...");

  try {
    const data = await fetchJson(`${apiBaseUrl}/api/status`);
    setApiStatus("online", "API online");
    showJson(data);
    return true;
  } catch (error) {
    setApiStatus("offline", "API offline");
    showJson({
      status: "offline",
      erro: "Servidor Node.js nao encontrado",
      solucao: "No terminal do projeto, execute: npm start"
    });
    showResult("API offline. Abra um terminal na pasta do projeto e rode npm start.", "error");
    return false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    showResult("Digite seu nome para enviar a requisicao.", "error");
    nameInput.focus();
    return;
  }

  submitButton.disabled = true;
  showResult("Enviando requisicao para o servidor Node.js...");

  try {
    const data = await fetchJson(buildGreetingEndpoint(name));
    setApiStatus("online", "API online");
    showResult(data.mensagem, "success");
    showJson(data);
  } catch (error) {
    setApiStatus("offline", "API offline");
    showResult(error.message || "Falha ao conectar com o back-end.", "error");
    showJson({
      status: "erro",
      mensagem: error.message,
      endpoint: apiBaseUrl
    });
  } finally {
    submitButton.disabled = false;
  }
});

nameInput.addEventListener("input", updateRoutePreview);
checkApiButton.addEventListener("click", checkApiStatus);

updateRoutePreview();
checkApiStatus();

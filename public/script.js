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

// Verifica se os elementos essenciais do DOM existem antes de continuar
if (!form || !nameInput || !result || !submitButton || !jsonOutput) {
  console.error("[init] Elementos essenciais do DOM nao encontrados. Verifique o HTML.");
  // Nao usa throw para nao quebrar a pagina — apenas interrompe a inicializacao
  return;
}

const API_PORT = "3000";
const REQUEST_TIMEOUT_MS = 5000;

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error("A API nao retornou JSON. Abra o projeto por http://localhost:3000 ou rode npm start.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Nao foi possivel concluir a requisicao.");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`A requisicao excedeu o tempo limite de ${REQUEST_TIMEOUT_MS / 1000}s. Verifique se o servidor esta rodando.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkApiStatus() {
  setApiStatus("checking", "Verificando API...");

  try {
    const data = await fetchJson(`${apiBaseUrl}/api/status`);
    setApiStatus("online", "API online");
    showJson(data);
    return true;
  } catch (error) {
    console.error("[checkApiStatus] Erro ao verificar API:", error);
    setApiStatus("offline", "API offline");
    showJson({
      status: "offline",
      erro: error.message || "Servidor Node.js nao encontrado",
      solucao: "No terminal do projeto, execute: npm start"
    });
    showResult(error.message || "API offline. Abra um terminal na pasta do projeto e rode npm start.", "error");
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

  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  showResult("Enviando requisicao para o servidor Node.js...");

  try {
    const data = await fetchJson(buildGreetingEndpoint(name));
    setApiStatus("online", "API online");
    showResult(data.mensagem, "success");
    showJson(data);
  } catch (error) {
    console.error("[submit] Erro ao enviar requisicao:", error);
    setApiStatus("offline", "API offline");
    showResult(error.message || "Falha ao conectar com o back-end.", "error");
    showJson({
      status: "erro",
      mensagem: error.message,
      endpoint: apiBaseUrl
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

nameInput.addEventListener("input", updateRoutePreview);
checkApiButton.addEventListener("click", checkApiStatus);

updateRoutePreview();
checkApiStatus();

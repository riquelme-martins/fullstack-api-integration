( function () {
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
    return;
  }

  const API_PORT = "3000";
  const REQUEST_TIMEOUT_MS = 5000;

  function getApiBaseUrl() {
  const { protocol, hostname, port, origin } = window.location;

  // Se abriu o HTML direto pelo arquivo (file://), usa localhost
  if (protocol === "file:") {
    return `http://localhost:${API_PORT}`;
  }

  // Se o servidor Node.js está servindo o HTML (mesma porta)
  if (port && port === API_PORT) {
    return origin;
  }

  // Se está em localhost/127.0.0.1 mas porta diferente (ex: live server)
  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return `http://${hostname}:${API_PORT}`;
  }

  // Fallback
  return `http://localhost:${API_PORT}`;
}

const apiBaseUrl = getApiBaseUrl();

function setApiStatus(status, message) {
  if (apiDot) apiDot.className = `status-dot ${status}`;
  if (apiStatus) apiStatus.textContent = message;
  if (apiUrl) apiUrl.textContent = `Endpoint: ${apiBaseUrl}`;
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

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (networkError) {
    clearTimeout(timeoutId);
    if (networkError.name === "AbortError") {
      throw new Error(`A requisicao excedeu o tempo limite de ${REQUEST_TIMEOUT_MS / 1000}s. Verifique se o servidor esta rodando em ${apiBaseUrl}.`);
    }
    // Erro de rede (servidor offline, CORS, conexão recusada)
    throw new Error(`Nao foi possivel conectar com a API em ${apiBaseUrl}. Verifique se o servidor esta rodando (npm start).`);
  }

  try {
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
      throw new Error(`A requisicao excedeu o tempo limite de ${REQUEST_TIMEOUT_MS / 1000}s.`);
    }
    // Se ja e um Error com mensagem especifica, repassa
    if (error.message && error.message.startsWith("Nao foi possivel")) {
      throw error;
    }
    if (error.message && error.message.startsWith("A API nao retornou")) {
      throw error;
    }
    throw new Error(`Erro ao processar resposta da API: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkApiStatus() {
  // Mostra o endpoint imediatamente, antes mesmo de verificar
  if (apiUrl) apiUrl.textContent = `Endpoint: ${apiBaseUrl}`;
  setApiStatus("checking", "Verificando API...");

  try {
    const data = await fetchJson(`${apiBaseUrl}/api/status`);
    setApiStatus("online", "API online");
    showJson(data);
    return true;
  } catch (error) {
    console.error("[checkApiStatus] Erro ao verificar API:", error);
    setApiStatus("offline", "API offline");
    const errorMsg = error.message || "Servidor Node.js nao encontrado";
    showJson({
      status: "offline",
      erro: errorMsg,
      endpoint: apiBaseUrl,
      solucao: "No terminal do projeto, execute: npm start"
    });
    showResult(errorMsg, "error");
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

  const endpoint = buildGreetingEndpoint(name);
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  showResult(`Enviando requisicao para ${endpoint}...`);
  showJson({ status: "enviando", endpoint });

  try {
    const data = await fetchJson(endpoint);
    setApiStatus("online", "API online");
    showResult(data.mensagem, "success");
    showJson(data);
  } catch (error) {
    console.error("[submit] Erro ao enviar requisicao:", error);
    setApiStatus("offline", "API offline");
    const errorMessage = error.message || "Falha ao conectar com o back-end.";
    showResult(errorMessage, "error");
    showJson({
      status: "erro",
      mensagem: errorMessage,
      endpoint: endpoint,
      dica: "Certifique-se de que o servidor Node.js esta rodando. No terminal do projeto, execute: npm start"
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
}() );

const form = document.querySelector("#greeting-form");
const nameInput = document.querySelector("#name");
const result = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  result.classList.remove("error");
  result.textContent = "Enviando requisicao ao servidor...";

  try {
    const response = await fetch(`/api/saudacao?nome=${encodeURIComponent(name)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Nao foi possivel gerar a saudacao.");
    }

    result.textContent = data.mensagem;
  } catch (error) {
    result.classList.add("error");
    result.textContent = error.message;
  }
});

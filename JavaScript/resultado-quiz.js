const resultadoAcertos = document.querySelector("#resultado-acertos");
const resultadoTotal = document.querySelector("#resultado-total");
const botaoRefazer = document.querySelector("#btn-refazer");

const acertos = Number(
    sessionStorage.getItem("quizAcertos") ?? 0
);

const respondidas = Number(
    sessionStorage.getItem("quizRespondidas") ?? 0
);

resultadoAcertos.textContent = acertos;
resultadoTotal.textContent = respondidas;

botaoRefazer.addEventListener("click", () => {

    sessionStorage.removeItem("quizAcertos");
    sessionStorage.removeItem("quizRespondidas");

    window.location.href = "portugues-2-exercicio1.html";

});
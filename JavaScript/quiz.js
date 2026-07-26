const opcoes = document.querySelectorAll(".opcao-resposta, .opcao");
const botaoConfirmar = document.querySelector("#btn-confirmar");
const botaoProxima = document.querySelector("#btn-proxima");

const feedback = document.querySelector("#quiz-feedback");
const feedbackTitulo = document.querySelector("#feedback-titulo");
const feedbackExplicacao = document.querySelector("#feedback-explicacao");

const questaoAtualElemento = document.querySelector("#questao-atual");
const totalQuestoesElemento = document.querySelector("#total-questoes");
const totalAcertosElemento = document.querySelector("#total-acertos");
const totalRespondidasElemento = document.querySelector("#total-respondidas");

const barraProgresso = document.querySelector(".barra-progresso");
const barraPreenchida = document.querySelector("#barra-preenchida");

let opcaoSelecionada = null;
let respostaConfirmada = false;

const questaoAtual = Number(questaoAtualElemento.textContent);
const totalQuestoes = Number(totalQuestoesElemento.textContent);

if (questaoAtual === 1) {
    sessionStorage.setItem("quizAcertos", "0");
    sessionStorage.setItem("quizRespondidas", "0");
}

let totalAcertos = Number(
    sessionStorage.getItem("quizAcertos") ?? 0
);

let totalRespondidas = Number(
    sessionStorage.getItem("quizRespondidas") ?? 0
);

atualizarProgresso();

opcoes.forEach((opcao) => {
    opcao.addEventListener("click", () => {
        if (respostaConfirmada) {
            return;
        }

        opcoes.forEach((item) => {
            item.classList.remove("selecionada");
            item.setAttribute("aria-pressed", "false");
        });

        opcao.classList.add("selecionada");
        opcao.setAttribute("aria-pressed", "true");

        opcaoSelecionada = opcao;
        botaoConfirmar.disabled = false;
    });
});

botaoConfirmar.addEventListener("click", () => {
    if (!opcaoSelecionada || respostaConfirmada) {
        return;
    }

    respostaConfirmada = true;

    const respostaCorreta =
        opcaoSelecionada.dataset.correta === "true";

    totalRespondidas++;

    if (respostaCorreta) {
        totalAcertos++;

        opcaoSelecionada.classList.remove("selecionada");
        opcaoSelecionada.classList.add("correta");

        feedback.classList.add("correto");
        feedbackTitulo.textContent = "Resposta correta!";
        feedbackExplicacao.textContent =
            "Muito bem! Você escolheu a alternativa correta.";
    } else {
        opcaoSelecionada.classList.remove("selecionada");
        opcaoSelecionada.classList.add("incorreta");

        const alternativaCorreta = document.querySelector(
            '[data-correta="true"]'
        );

        alternativaCorreta.classList.add("correta");

        feedback.classList.add("incorreto");
        feedbackTitulo.textContent = "Resposta incorreta.";
        feedbackExplicacao.textContent =
            "Observe a alternativa destacada em verde.";
    }

    sessionStorage.setItem(
        "quizAcertos",
        String(totalAcertos)
    );

    sessionStorage.setItem(
        "quizRespondidas",
        String(totalRespondidas)
    );

    opcoes.forEach((opcao) => {
        opcao.disabled = true;
    });

    botaoConfirmar.disabled = true;
    feedback.hidden = false;
    botaoProxima.hidden = false;

    atualizarProgresso();
});

botaoProxima.addEventListener("click", () => {
    const proximaPagina =
        botaoProxima.dataset.proximaPagina;

    if (!proximaPagina) {
        return;
    }

    if (questaoAtual === totalQuestoes) {
        sessionStorage.removeItem("quizAcertos");
        sessionStorage.removeItem("quizRespondidas");
    }

    window.location.href = proximaPagina;
});

function atualizarProgresso() {
    totalAcertosElemento.textContent = totalAcertos;
    totalRespondidasElemento.textContent = totalRespondidas;

    const porcentagem =
        (questaoAtual / totalQuestoes) * 100;

    barraPreenchida.style.width = `${porcentagem}%`;

    barraProgresso.setAttribute(
        "aria-valuemax",
        String(totalQuestoes)
    );

    barraProgresso.setAttribute(
        "aria-valuenow",
        String(questaoAtual)
    );
}
// integração com o backend menu lateral
document.addEventListener('DOMContentLoaded', () => {
    //Recupera as credenciais temporárias do navegador
    const token = localStorage.getItem('token');
    const usuarioString = localStorage.getItem('usuarioLogado');

    //Barreira de Segurança
    if (!token || !usuarioString) {
        window.location.href = 'login.html';
        return;
    }

    //Converte para Objeto JavaScript
    const dadosDoUsuario = JSON.parse(usuarioString);

    const txtMenuLateral = document.getElementById('nome-menu-lateral');
    const txtBoasVindas = document.getElementById('nome-boas-vindas');
    const txtCardCentral = document.getElementById('nome-card-central');
    const txtIdade = document.getElementById('idade-usuario'); 

    if (txtMenuLateral) txtMenuLateral.textContent = dadosDoUsuario.nome;
    if (txtBoasVindas) txtBoasVindas.textContent = dadosDoUsuario.nome;
    if (txtCardCentral) txtCardCentral.textContent = dadosDoUsuario.nome;

    if (txtIdade && dadosDoUsuario.nascimento) {
        txtIdade.textContent = calcularIdade(dadosDoUsuario.nascimento);
    }
});

//calculo da idade do usuario
function calcularIdade(dataNascimentoString) {
    if (!dataNascimentoString) return "N/A";

    const hoje = new Date();
    const nascimento = new Date(dataNascimentoString);

    // Se a data for inválida para o JavaScript, evita cálculos com retorno bizarro
    if (isNaN(nascimento.getTime())) {
        return "N/A";
    }
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--; 
    }
    
    return idade;
}
// plugin VLibras
new window.VLibras.Widget('https://vlibras.gov.br/app')

//integração com o backend
const btnCadastrar = document.getElementById('btn-cadastrar');

btnCadastrar.addEventListener('click', async () => {
    const nome = document.getElementById('text').value;
    const nascimento = document.getElementById('DTN').value;
    const email = document.getElementById('email').value;
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('csenha').value;
    const termosAceitos = document.getElementById('termos').checked;

    // Validações feitas aqui no front, antes de mandar pro backend
    if (!nome || !nascimento || !email || !usuario || !senha || !confirmarSenha) {
        alert('Preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    if (!termosAceitos) {
        alert('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, nascimento, email, usuario, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.error);
            return;
        }

        alert('Conta criada com sucesso! Faça login para continuar.');
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
});
// plugin VLibras
new window.VLibras.Widget('https://vlibras.gov.br/app')

//intregração com o backend
const btnEntrar = document.getElementById('btn-entrar');
btnEntrar.addEventListener('click', async () => {
    const identificador = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    if(!identificador || !senha) {
        alert('Preencha todos os campos');
        return;
    }

    try {
        const resposta = await fetch ('https://projeto-site-harpia.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identificador, senha })
        })

        const dados = await resposta.json()
        if (!resposta.ok) {
            alert(dados.error);
            return
        }

        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

        window.location.href = 'pg-usuario.html';

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está funcionando.');
    }
})
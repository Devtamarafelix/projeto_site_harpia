// plugin VLibras
 new window.VLibras.Widget('https://vlibras.gov.br/app')

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
    const txtNomeUserPluma = document.getElementById('nome-user-pluma')
    const txtIdade = document.getElementById('idade-usuario'); 

    if (txtMenuLateral) txtMenuLateral.textContent = dadosDoUsuario.nome;
    if (txtBoasVindas) txtBoasVindas.textContent = dadosDoUsuario.nome;
    if (txtCardCentral) txtCardCentral.textContent = dadosDoUsuario.nome;
    if (txtCardCentral) txtNomeUserPluma.textContent = dadosDoUsuario.nome;

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

// carrega a foto do usuario logado no menu lateral de todas as páginas
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado?.foto_perfil) {
        const urlFotoSalva = `${API_BASE_URL}${usuarioLogado.foto_perfil}`;
        document.querySelectorAll('.foto-perfil-dinamica').forEach((img) => {
            img.src = urlFotoSalva;
        });
    }
});


// js para o botão de video aula nas páginas de matérias
const btnVideo = document.querySelector('.btn-video');
const videoContainer = document.querySelector('.video-container');

if (btnVideo && videoContainer) {
  btnVideo.addEventListener('click', () => {
    const videoId = btnVideo.dataset.videoId;

    if (!videoId) return;

    const btnFechar = document.createElement('button');
    btnFechar.textContent = '✖ Fechar Vídeo';
    btnFechar.classList.add('btn-fechar');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = 'YouTube video player';
    iframe.width = '100%';
    iframe.height = '315';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', 'true');

    btnFechar.addEventListener('click', () => {
      videoContainer.innerHTML = '';
      btnVideo.style.display = 'inline-block';
    });

    videoContainer.appendChild(btnFechar);
    videoContainer.appendChild(iframe);

    btnVideo.style.display = 'none';
  });
}
//upload foto de perfil
const inputAvatar = document.getElementById('input-avatar');
const avatarPrincipal = document.getElementById('avatar-principal');

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

inputAvatar.addEventListener('change', async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append('avatar', arquivo);

    const token = localStorage.getItem('token'); 

    try {
        console.log("Iniciando envio da imagem...");
        const resposta = await fetch(`${API_BASE_URL}/perfil/avatar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!resposta.ok) {
            const textoErro = await resposta.text();
            console.error(`Erro do servidor (${resposta.status}):`, textoErro);
            alert(`O servidor recusou a imagem (Status ${resposta.status}). Verifique o console.`);
            return;
        }

        const dados = await resposta.json();

        alert("Foto atualizada com sucesso!");

        if (usuarioLogado) {
            usuarioLogado.foto_perfil = dados.foto;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        }

        const novaUrlUrl = `${API_BASE_URL}${dados.foto}`;
        console.log("=== DIAGNÓSTICO DE ATUALIZAÇÃO ===");
        console.log("URL retornada pelo servidor:", novaUrlUrl);

        const todasAsFotos = document.querySelectorAll('.foto-perfil-dinamica');
        console.log("Quantidade de fotos encontradas:", todasAsFotos.length);

        todasAsFotos.forEach((img, index) => {
            if (img.tagName === 'IMG') {
                img.src = `${novaUrlUrl}?t=${Date.now()}`;
                console.log(`[Foto ${index + 1}] Atualizada com sucesso.`);
            }
        });

    } catch (erro) {
        console.error("Erro capturado no catch:", erro);
        alert(`Erro de conexão ou no script: ${erro.message}`);
    }
});


//lógica para o input de busca
function inicializarBusca() {
  const buscarCursos = document.getElementById('buscar-cursos');
  const cardsCursos = document.querySelectorAll('.curso-card, .continue-card');
  const secaoCursos = document.querySelector('.secao-cursos');

  if (!buscarCursos) return;

  buscarCursos.addEventListener('input', () => {
    const filtroBusca = buscarCursos.value.toLowerCase().trim();

    if (filtroBusca.length > 0 && secaoCursos) {
      secaoCursos.scrollIntoView({ 
        behavior: 'smooth', // Rola de forma suave, sem dar "pulo"
        block: 'start'      // Alinha o topo da seção de cursos com a tela
      });
    }

    cardsCursos.forEach(card => {
      const tituloElemento = card.querySelector('h3');

      if (tituloElemento) {
        const tituloText = tituloElemento.textContent.toLowerCase();

        if (tituloText.includes(filtroBusca)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
}

// Executa a busca imediatamente primeiro
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarBusca);
} else {
  inicializarBusca();
}
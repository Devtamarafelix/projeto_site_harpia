//lógica para o input de busca

const buscarCursos = document.getElementById('buscar-cursos')
const cardsCursos = document.querySelectorAll('.categorias-cards, .destaque-cards')
const secaoCursos = document.querySelector('.secao-cursos, cursos-destaque');

buscarCursos.addEventListener('input', () => {
    const filtroBusca = buscarCursos.value.toLowerCase().trim()

    if (filtroBusca.length > 0 && secaoCursos) {
      secaoCursos.scrollIntoView({ 
        behavior: 'smooth', // Rola de forma suave, sem dar "pulo"
        block: 'start'      // Alinha o topo da seção de cursos com a tela
      });
    }

    cardsCursos.forEach(card => {
        const tituloCard = card.querySelector('h3').textContent.toLowerCase()

        if (tituloCard.includes(filtroBusca)) {
            card.style.display = ''
        } else {
            card.style.display = 'none'
        }
    })
})
const chatIcone = document.getElementById('chat-icone');
const chatContainer = document.getElementById('chat-container');
const btnFechar = document.getElementById('btn-fechar');

const chatBox = document.getElementById('chat-box');
const inputUsuario = document.getElementById('input-usuario');
const btnEnviar = document.getElementById('btn-enviar');

// Abre e fecha o chat
chatIcone.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  chatIcone.style.display = 'none';
});

btnFechar.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  chatIcone.style.display = 'flex'; // Removida a linha fantasma que travava o fechamento
});

// Adiciona as bolhas de mensagem na tela com suporte a negrito
function adicionarMensagem(texto, tipo) {
  const div = document.createElement('div');
  div.classList.add('message', tipo);
  
  if (tipo === 'bot') {
    // Transforma o formato **texto** do Groq em tags <strong> do HTML
    const textoFormatado = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    div.innerHTML = textoFormatado;
  } else {
    // Mensagens do usuário continuam como texto puro por segurança
    div.innerText = texto;
  }
  
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Faz a ponte com o seu server.js
async function lidarComEnvio() {
  const mensagem = inputUsuario.value.trim();
  if (mensagem === '') return;

  // 1. Mostra a mensagem do usuário na tela
  adicionarMensagem(mensagem, 'user');
  inputUsuario.value = '';

  // 2. Cria o balão de "Digitando..."
  const divPensando = document.createElement('div');
  divPensando.classList.add('message', 'bot');
  divPensando.innerHTML = 'Pluma está digitando... 🐦';
  chatBox.appendChild(divPensando);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // 3. Envia o texto para o nosso backend Node na porta 3000
    const response = await fetch('https://darkred-duck-282519.hostingersite.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: mensagem })
    });

    const data = await response.json();
    
    // Remove o balão de digitando se ele ainda estiver na tela
    if (chatBox.contains(divPensando)) chatBox.removeChild(divPensando);

    // 4. Mostra a resposta da Pluma
    if (data.resposta) {
      adicionarMensagem(data.resposta, 'bot');
    } else {
      adicionarMensagem('Fiquei um pouco confusa, pode repetir?', 'bot');
    }

  } catch (error) {
    if (chatBox.contains(divPensando)) chatBox.removeChild(divPensando);
    adicionarMensagem('Não consegui voar até o servidor. Ele está ligado?', 'bot');
  }
}

btnEnviar.addEventListener('click', lidarComEnvio);
inputUsuario.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') lidarComEnvio();
});
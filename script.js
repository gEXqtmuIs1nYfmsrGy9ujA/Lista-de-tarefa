// Procuramos no HTML os elementos que vamos usar.
const formulario = document.querySelector('#form-tarefa');
const campo = document.querySelector('#campo-tarefa');
const lista = document.querySelector('#lista-tarefas');
const contador = document.querySelector('#contador');
const mensagemVazia = document.querySelector('#mensagem-vazia');

// Recuperamos as tarefas salvas no navegador.
let tarefas = JSON.parse(localStorage.getItem('minhas-tarefas')) || [];

// Mostramos as tarefas na página.
function mostrarTarefas() {
  lista.innerHTML = '';

  tarefas.forEach((tarefa) => {
    const item = document.createElement('li');
    item.className = tarefa.concluida ? 'tarefa concluida' : 'tarefa';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute('aria-label', `Marcar ${tarefa.texto} como concluída`);
    checkbox.addEventListener('change', () => alternarTarefa(tarefa.id));

    const texto = document.createElement('span');
    texto.className = 'tarefa-texto';
    texto.textContent = tarefa.texto;

    const botaoApagar = document.createElement('button');
    botaoApagar.className = 'apagar';
    botaoApagar.type = 'button';
    botaoApagar.textContent = '×';
    botaoApagar.setAttribute('aria-label', `Apagar ${tarefa.texto}`);
    botaoApagar.addEventListener('click', () => apagarTarefa(tarefa.id));

    item.append(checkbox, texto, botaoApagar);
    lista.append(item);
  });

  const quantidade = tarefas.length;
  contador.textContent =
    `${quantidade} ${quantidade === 1 ? 'tarefa' : 'tarefas'}`;

  mensagemVazia.hidden = quantidade > 0;
}

// Salvamos a lista no navegador.
function salvarTarefas() {
  localStorage.setItem('minhas-tarefas', JSON.stringify(tarefas));
}

// Adicionamos uma tarefa nova.
function adicionarTarefa(texto) {
  tarefas.push({
    id: Date.now(),
    texto: texto,
    concluida: false
  });

  salvarTarefas();
  mostrarTarefas();
}

// Marcamos ou desmarcamos uma tarefa.
function alternarTarefa(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return { ...tarefa, concluida: !tarefa.concluida };
    }

    return tarefa;
  });

  salvarTarefas();
  mostrarTarefas();
}

// Apagamos uma tarefa.
function apagarTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);

  salvarTarefas();
  mostrarTarefas();
}

// Quando enviamos o formulário, adicionamos a tarefa.
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const texto = campo.value.trim();

  if (texto === '') {
    return;
  }

  adicionarTarefa(texto);
  campo.value = '';
  campo.focus();
});

// Mostramos as tarefas salvas ao abrir a página.
mostrarTarefas();
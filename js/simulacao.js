"use strict";

// Simulação do CityFix: lista de ocorrências, filtros, botão "Apoiar"
// e indicadores de impacto. Depende de js/dados.js (array ocorrencias),
// que precisa ser carregado antes deste arquivo.
// Cada parte só roda se os elementos dela existirem na página, então o
// mesmo arquivo serve para solucao.html e impacto.html.

const listaOcorrencias = document.getElementById("lista-ocorrencias");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroBairro = document.getElementById("filtro-bairro");
const filtroStatus = document.getElementById("filtro-status");
const botaoLimparFiltros = document.getElementById("limpar-filtros");
const resumoOcorrencias = document.getElementById("resumo-ocorrencias");
const mensagemLista = document.getElementById("mensagem-lista");
// Campos do formulário (Pietro): as opções vêm das mesmas listas de dados.js.
const campoTipo = document.getElementById("campo-tipo");
const campoBairro = document.getElementById("campo-bairro");

// ---------- Funções auxiliares ----------

// Lista fixa + qualquer valor diferente que exista nos dados salvos,
// sem repetição e em ordem alfabética.
function opcoesDe(listaFixa, campo) {
  const valores = listaFixa.slice();
  ocorrencias.forEach((ocorrencia) => {
    if (!valores.includes(ocorrencia[campo])) {
      valores.push(ocorrencia[campo]);
    }
  });
  return valores.sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// Recria as opções de um <select>, mantendo a opção "Todos" e a escolha atual.
function preencherSelect(select, valores, textoTodos) {
  if (!select) {
    return;
  }
  const valorAtual = select.value;
  select.textContent = "";

  const opcaoTodos = document.createElement("option");
  opcaoTodos.value = "";
  opcaoTodos.textContent = textoTodos;
  select.appendChild(opcaoTodos);

  valores.forEach((valor) => {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = valor;
    select.appendChild(opcao);
  });

  // Se a opção escolhida ainda existe, continua selecionada.
  select.value = valores.includes(valorAtual) ? valorAtual : "";
}

// Monta as opções dos filtros e do formulário a partir das listas de dados.js.
// Roda ao abrir a página (e quando outra aba muda os dados), não a cada clique.
function atualizarOpcoes() {
  const tipos = opcoesDe(TIPOS_OCORRENCIA, "tipo");
  const bairros = opcoesDe(BAIRROS_OCORRENCIA, "bairro");

  preencherSelect(filtroTipo, tipos, "Todos os tipos");
  preencherSelect(filtroBairro, bairros, "Todos os bairros");
  preencherSelect(filtroStatus, STATUS_OCORRENCIA, "Todos os status");

  // No formulário só entram os valores oficiais.
  preencherSelect(campoTipo, TIPOS_OCORRENCIA, "Selecione o tipo");
  preencherSelect(campoBairro, BAIRROS_OCORRENCIA, "Selecione o bairro");
}

// Aplica os três filtros juntos. Filtro vazio significa "todos".
function filtrarOcorrencias() {
  const tipo = filtroTipo ? filtroTipo.value : "";
  const bairro = filtroBairro ? filtroBairro.value : "";
  const status = filtroStatus ? filtroStatus.value : "";

  return ocorrencias.filter((ocorrencia) => {
    const tipoOk = tipo === "" || ocorrencia.tipo === tipo;
    const bairroOk = bairro === "" || ocorrencia.bairro === bairro;
    const statusOk = status === "" || ocorrencia.status === status;
    return tipoOk && bairroOk && statusOk;
  });
}

// Mais apoiadas primeiro; em caso de empate, a mais antiga (menor id) primeiro.
function ordenarPorVotos(lista) {
  return lista.slice().sort((a, b) => b.votos - a.votos || a.id - b.id);
}

// Classe CSS do selo de status: "Em análise" vira "status-em-analise".
function classeDoStatus(status) {
  const semAcento = status.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return "status-" + semAcento.toLowerCase().replace(/\s+/g, "-");
}

function textoApoios(votos) {
  return votos === 1 ? "1 apoio" : votos + " apoios";
}

// Monta o cartão (<li>) de uma ocorrência usando o DOM.
// Usa textContent (e não innerHTML) para que textos digitados no
// formulário nunca sejam interpretados como HTML.
function criarCartaoOcorrencia(ocorrencia) {
  const item = document.createElement("li");
  item.className = "ocorrencia-card";

  const cabecalho = document.createElement("div");
  cabecalho.className = "ocorrencia-cabecalho";

  const titulo = document.createElement("h3");
  titulo.textContent = ocorrencia.tipo;

  const selo = document.createElement("span");
  selo.className = "status-selo " + classeDoStatus(ocorrencia.status);
  selo.textContent = ocorrencia.status;

  cabecalho.append(titulo, selo);

  const bairro = document.createElement("p");
  bairro.className = "ocorrencia-bairro";
  bairro.textContent = "Bairro: " + ocorrencia.bairro;

  const descricao = document.createElement("p");
  descricao.textContent = ocorrencia.descricao;

  const rodape = document.createElement("div");
  rodape.className = "ocorrencia-rodape";

  const votos = document.createElement("p");
  votos.className = "ocorrencia-votos";
  votos.textContent = textoApoios(ocorrencia.votos);

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "botao-apoiar";
  botao.dataset.id = String(ocorrencia.id);
  botao.textContent = "Apoiar";
  // Leitores de tela anunciam qual ocorrência está sendo apoiada.
  botao.setAttribute("aria-label", "Apoiar: " + ocorrencia.tipo + " em " + ocorrencia.bairro);

  rodape.append(votos, botao);
  item.append(cabecalho, bairro, descricao, rodape);
  return item;
}

// ---------- Função principal (contrato com o formulário) ----------

// Salva os dados, redesenha a lista aplicando os filtros e a ordem por
// votos e atualiza os indicadores.
// O formulário chama esta função depois de adicionar uma ocorrência;
// por isso a ocorrência nova também fica salva no localStorage.
function renderizarOcorrencias() {
  salvarOcorrencias();
  atualizarIndicadores();

  if (!listaOcorrencias) {
    return;
  }

  const visiveis = ordenarPorVotos(filtrarOcorrencias());
  listaOcorrencias.textContent = "";

  if (visiveis.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "lista-vazia";
    vazio.textContent = "Nenhuma ocorrência encontrada com esses filtros. Tente outro filtro ou clique em “Limpar filtros”.";
    listaOcorrencias.appendChild(vazio);
  } else {
    visiveis.forEach((ocorrencia) => {
      listaOcorrencias.appendChild(criarCartaoOcorrencia(ocorrencia));
    });
  }

  if (resumoOcorrencias) {
    resumoOcorrencias.textContent = "Mostrando " + visiveis.length + " de " + ocorrencias.length + " ocorrências.";
  }
}

// ---------- Apoiar ----------

function apoiarOcorrencia(id) {
  const ocorrencia = ocorrencias.find((item) => item.id === id);
  if (!ocorrencia) {
    return;
  }

  ocorrencia.votos += 1;
  renderizarOcorrencias();

  // A lista foi redesenhada: devolve o foco ao botão da mesma ocorrência
  // para quem navega pelo teclado não voltar ao início da página.
  const botao = listaOcorrencias.querySelector('.botao-apoiar[data-id="' + id + '"]');
  if (botao) {
    botao.focus();
  }

  if (mensagemLista) {
    mensagemLista.textContent = "Apoio registrado: " + ocorrencia.tipo + " em " + ocorrencia.bairro +
      " agora tem " + textoApoios(ocorrencia.votos) + ".";
  }
}

// ---------- Indicadores (impacto.html) ----------

// Calcula os indicadores a partir do mesmo array usado na lista.
function calcularIndicadores() {
  const total = ocorrencias.length;
  const resolvidas = ocorrencias.filter((ocorrencia) => ocorrencia.status === "Resolvida").length;
  const abertas = ocorrencias.filter((ocorrencia) => ocorrencia.status === "Aberta").length;
  const percentual = total === 0 ? 0 : Math.round((resolvidas / total) * 100);
  const maisApoiada = total === 0 ? null : ordenarPorVotos(ocorrencias)[0];

  return { total, resolvidas, abertas, percentual, maisApoiada };
}

function preencherIndicador(nome, texto) {
  const elemento = document.querySelector('[data-stat="' + nome + '"]');
  if (elemento) {
    elemento.textContent = texto;
  }
}

function atualizarIndicadores() {
  const indicadores = calcularIndicadores();

  preencherIndicador("total", String(indicadores.total));
  preencherIndicador("resolved", String(indicadores.resolvidas));
  preencherIndicador("resolved-rate", indicadores.percentual + "%");
  // Etiqueta sobre a foto da página inicial.
  preencherIndicador("open", indicadores.abertas + (indicadores.abertas === 1 ? " ocorrência aberta" : " ocorrências abertas"));
  preencherIndicador(
    "most-supported",
    indicadores.maisApoiada
      ? indicadores.maisApoiada.tipo + " em " + indicadores.maisApoiada.bairro +
        " (" + textoApoios(indicadores.maisApoiada.votos) + ")"
      : "Nenhuma ocorrência"
  );
}

// ---------- Eventos ----------

[filtroTipo, filtroBairro, filtroStatus].forEach((filtro) => {
  if (filtro) {
    filtro.addEventListener("change", renderizarOcorrencias);
  }
});

if (botaoLimparFiltros) {
  botaoLimparFiltros.addEventListener("click", () => {
    [filtroTipo, filtroBairro, filtroStatus].forEach((filtro) => {
      if (filtro) {
        filtro.value = "";
      }
    });
    renderizarOcorrencias();
    if (mensagemLista) {
      mensagemLista.textContent = "Filtros limpos. Mostrando todas as ocorrências.";
    }
  });
}

// Um único "ouvinte" na lista atende todos os botões "Apoiar",
// inclusive os de ocorrências adicionadas depois pelo formulário.
if (listaOcorrencias) {
  listaOcorrencias.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-apoiar");
    if (botao) {
      apoiarOcorrencia(Number(botao.dataset.id));
    }
  });
}

// Se outra aba salvar mudanças, esta aba recarrega os dados e se atualiza.
window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_ARMAZENAMENTO && carregarOcorrencias()) {
    atualizarOpcoes();
    renderizarOcorrencias();
  }
});

atualizarOpcoes();
renderizarOcorrencias();

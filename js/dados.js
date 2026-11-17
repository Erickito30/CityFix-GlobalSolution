"use strict";

// Dados simulados do protótipo CityFix (não são ocorrências reais).
// Fonte única de dados: a lista (solucao.html), o formulário e os
// indicadores (impacto.html) leem e alteram este mesmo array.
// As mudanças são salvas no localStorage por renderizarOcorrencias().
// Formato de cada objeto: { id, tipo, bairro, descricao, status, votos }

// Valores usados nos campos "tipo" e "status". Reutilize estas listas
// no formulário e nos filtros para manter os valores consistentes.
const TIPOS_OCORRENCIA = [
  "Buraco na via",
  "Calçada danificada",
  "Iluminação pública",
  "Lixo acumulado",
  "Sinalização"
];

const STATUS_OCORRENCIA = ["Aberta", "Em análise", "Resolvida"];

const ocorrencias = [
  {
    id: 1,
    tipo: "Buraco na via",
    bairro: "Mooca",
    descricao: "Buraco grande na Rua da Mooca, perto do ponto de ônibus. Carros desviam para a contramão.",
    status: "Aberta",
    votos: 41
  },
  {
    id: 2,
    tipo: "Iluminação pública",
    bairro: "Capão Redondo",
    descricao: "Três postes apagados na mesma quadra. A rua fica escura no caminho de volta da escola.",
    status: "Em análise",
    votos: 37
  },
  {
    id: 3,
    tipo: "Calçada danificada",
    bairro: "Centro",
    descricao: "Calçada quebrada e sem rampa na esquina. Cadeirantes precisam descer para a rua.",
    status: "Aberta",
    votos: 29
  },
  {
    id: 4,
    tipo: "Lixo acumulado",
    bairro: "Capão Redondo",
    descricao: "Entulho e lixo acumulados em terreno baldio há mais de um mês, com mau cheiro e ratos.",
    status: "Aberta",
    votos: 26
  },
  {
    id: 5,
    tipo: "Sinalização",
    bairro: "Pinheiros",
    descricao: "Faixa de pedestres apagada em frente à escola estadual.",
    status: "Resolvida",
    votos: 22
  },
  {
    id: 6,
    tipo: "Buraco na via",
    bairro: "Itaquera",
    descricao: "Cratera aberta depois da chuva na avenida principal do bairro.",
    status: "Em análise",
    votos: 19
  },
  {
    id: 7,
    tipo: "Iluminação pública",
    bairro: "Mooca",
    descricao: "Poste piscando a noite toda na praça, deixando a área insegura.",
    status: "Resolvida",
    votos: 15
  },
  {
    id: 8,
    tipo: "Calçada danificada",
    bairro: "Itaquera",
    descricao: "Raiz de árvore levantou a calçada. Idosos já tropeçaram no local.",
    status: "Aberta",
    votos: 12
  },
  {
    id: 9,
    tipo: "Lixo acumulado",
    bairro: "Centro",
    descricao: "Lixeiras transbordando na rua comercial, coleta não passa há dias.",
    status: "Resolvida",
    votos: 9
  },
  {
    id: 10,
    tipo: "Sinalização",
    bairro: "Capão Redondo",
    descricao: "Placa de PARE derrubada no cruzamento, motoristas não param.",
    status: "Em análise",
    votos: 7
  },
  {
    id: 11,
    tipo: "Buraco na via",
    bairro: "Pinheiros",
    descricao: "Buraco na ciclofaixa, ciclistas precisam ir para a pista dos carros.",
    status: "Resolvida",
    votos: 5
  },
  {
    id: 12,
    tipo: "Iluminação pública",
    bairro: "Centro",
    descricao: "Túnel de pedestres sem nenhuma lâmpada funcionando.",
    status: "Aberta",
    votos: 3
  }
];

// ---------- Armazenamento no navegador (localStorage) ----------
// Assim os apoios e as ocorrências novas continuam depois do F5 e
// aparecem também nos indicadores de impacto.html.

const CHAVE_ARMAZENAMENTO = "cityfix-ocorrencias";

// Cópia dos dados de exemplo, usada pelo botão "Restaurar dados de exemplo".
const OCORRENCIAS_EXEMPLO = JSON.parse(JSON.stringify(ocorrencias));

// Confere se um objeto salvo tem o formato combinado.
function ocorrenciaValida(item) {
  return item !== null &&
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.tipo === "string" &&
    typeof item.bairro === "string" &&
    typeof item.descricao === "string" &&
    STATUS_OCORRENCIA.includes(item.status) &&
    typeof item.votos === "number";
}

// Troca o conteúdo do array sem criar outro array, para que todos os
// arquivos continuem usando a mesma lista "ocorrencias".
function substituirOcorrencias(novaLista) {
  ocorrencias.length = 0;
  novaLista.forEach((item) => ocorrencias.push(item));
}

function salvarOcorrencias() {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(ocorrencias));
  } catch (erro) {
    // Armazenamento bloqueado ou cheio: o site continua funcionando,
    // só não guarda as mudanças depois de recarregar.
  }
}

function carregarOcorrencias() {
  try {
    const texto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (texto === null) {
      return;
    }
    const salvas = JSON.parse(texto);
    if (Array.isArray(salvas) && salvas.length > 0 && salvas.every(ocorrenciaValida)) {
      substituirOcorrencias(salvas);
    } else {
      localStorage.removeItem(CHAVE_ARMAZENAMENTO);
    }
  } catch (erro) {
    // Dado salvo corrompido ou armazenamento indisponível: usa os dados de exemplo.
  }
}

function restaurarDadosExemplo() {
  substituirOcorrencias(JSON.parse(JSON.stringify(OCORRENCIAS_EXEMPLO)));
  try {
    localStorage.removeItem(CHAVE_ARMAZENAMENTO);
  } catch (erro) {
    // Sem armazenamento: só os dados em memória são restaurados.
  }
}

// ID único para uma ocorrência nova (usado pelo formulário).
function gerarProximoId() {
  let maior = 0;
  ocorrencias.forEach((ocorrencia) => {
    if (ocorrencia.id > maior) {
      maior = ocorrencia.id;
    }
  });
  return maior + 1;
}

carregarOcorrencias();

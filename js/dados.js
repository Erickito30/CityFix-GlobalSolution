"use strict";

// Dados simulados do protótipo CityFix (não são ocorrências reais).
// Fonte única de dados: a lista (solucao.html), o formulário e os
// indicadores (impacto.html) leem e alteram este mesmo array.
// As mudanças são salvas no localStorage por renderizarOcorrencias().
// Formato de cada objeto: { id, tipo, bairro, descricao, status, votos }

// Valores usados nos campos "tipo", "bairro" e "status". Precisam ser
// iguais às opções do formulário em solucao.html (js/formulario.js).
const TIPOS_OCORRENCIA = [
  "Buraco na rua",
  "Calçada quebrada",
  "Falta de rampa",
  "Iluminação",
  "Lixo acumulado"
];

// Bairros atendidos pelo protótipo (os mesmos do formulário).
const BAIRROS_OCORRENCIA = ["Centro", "Mooca", "Pinheiros", "Saúde", "Vila Mariana"];

const STATUS_OCORRENCIA = ["Aberta", "Em análise", "Resolvida"];

const ocorrencias = [
  {
    id: 1,
    tipo: "Buraco na rua",
    bairro: "Mooca",
    descricao: "Buraco grande na Rua da Mooca, perto do ponto de ônibus. Carros desviam para a contramão.",
    status: "Aberta",
    votos: 41
  },
  {
    id: 2,
    tipo: "Iluminação",
    bairro: "Saúde",
    descricao: "Três postes apagados na mesma quadra. A rua fica escura no caminho de volta da escola.",
    status: "Em análise",
    votos: 37
  },
  {
    id: 3,
    tipo: "Falta de rampa",
    bairro: "Centro",
    descricao: "Esquina movimentada sem rampa. Cadeirantes precisam descer para a rua para atravessar.",
    status: "Aberta",
    votos: 29
  },
  {
    id: 4,
    tipo: "Lixo acumulado",
    bairro: "Vila Mariana",
    descricao: "Entulho e lixo acumulados em terreno baldio há mais de um mês, com mau cheiro e ratos.",
    status: "Aberta",
    votos: 26
  },
  {
    id: 5,
    tipo: "Calçada quebrada",
    bairro: "Pinheiros",
    descricao: "Calçada afundada em frente à escola estadual, com poças quando chove.",
    status: "Resolvida",
    votos: 22
  },
  {
    id: 6,
    tipo: "Buraco na rua",
    bairro: "Saúde",
    descricao: "Cratera aberta depois da chuva na avenida principal do bairro.",
    status: "Em análise",
    votos: 19
  },
  {
    id: 7,
    tipo: "Iluminação",
    bairro: "Mooca",
    descricao: "Poste piscando a noite toda na praça, deixando a área insegura.",
    status: "Resolvida",
    votos: 15
  },
  {
    id: 8,
    tipo: "Calçada quebrada",
    bairro: "Vila Mariana",
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
    tipo: "Falta de rampa",
    bairro: "Saúde",
    descricao: "Rampa de acesso ao posto de saúde quebrada, sem como subir de cadeira de rodas.",
    status: "Em análise",
    votos: 7
  },
  {
    id: 11,
    tipo: "Buraco na rua",
    bairro: "Pinheiros",
    descricao: "Buraco na ciclofaixa, ciclistas precisam ir para a pista dos carros.",
    status: "Resolvida",
    votos: 5
  },
  {
    id: 12,
    tipo: "Iluminação",
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

// Confere se um objeto salvo tem o formato combinado.
function ocorrenciaValida(item) {
  return item !== null &&
    typeof item === "object" &&
    typeof item.id === "number" &&
    TIPOS_OCORRENCIA.includes(item.tipo) &&
    BAIRROS_OCORRENCIA.includes(item.bairro) &&
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

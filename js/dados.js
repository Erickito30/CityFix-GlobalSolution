"use strict";

const TIPOS_OCORRENCIA = [
  "Buraco na rua",
  "Calçada quebrada",
  "Falta de rampa",
  "Iluminação",
  "Lixo acumulado"
];

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

const CHAVE_ARMAZENAMENTO = "cityfix-ocorrencias";

let ultimoTextoSalvo = JSON.stringify(ocorrencias);

function ehTextoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function ehInteiroPositivo(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function ocorrenciaValida(item) {
  return item !== null &&
    typeof item === "object" &&
    ehInteiroPositivo(item.id) &&
    ehTextoPreenchido(item.tipo) &&
    ehTextoPreenchido(item.bairro) &&
    typeof item.descricao === "string" &&
    STATUS_OCORRENCIA.includes(item.status) &&
    Number.isInteger(item.votos) &&
    item.votos >= 0;
}

function filtrarOcorrenciasValidas(lista) {
  const idsVistos = [];
  return lista.filter((item) => {
    if (!ocorrenciaValida(item) || idsVistos.includes(item.id)) {
      return false;
    }
    idsVistos.push(item.id);
    return true;
  });
}

function substituirOcorrencias(novaLista) {
  ocorrencias.length = 0;
  novaLista.forEach((item) => ocorrencias.push(item));
}

function salvarOcorrencias() {
  const texto = JSON.stringify(ocorrencias);
  if (texto === ultimoTextoSalvo) {
    return;
  }
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, texto);
    ultimoTextoSalvo = texto;
  } catch (erro) {
  }
}

function carregarOcorrencias() {
  try {
    const texto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (texto === null) {
      return false;
    }
    const salvas = JSON.parse(texto);
    const validas = Array.isArray(salvas) ? filtrarOcorrenciasValidas(salvas) : [];
    if (validas.length === 0) {
      localStorage.removeItem(CHAVE_ARMAZENAMENTO);
      return false;
    }
    substituirOcorrencias(validas);
    ultimoTextoSalvo = validas.length === salvas.length ? texto : null;
    return true;
  } catch (erro) {
    return false;
  }
}

carregarOcorrencias();

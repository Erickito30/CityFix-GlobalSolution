"use strict";

function iniciarFormulario() {
  const formulario = document.getElementById("formulario-ocorrencia");
  const mensagem = document.getElementById("mensagem-formulario");

  if (!formulario || !mensagem) {
    return;
  }

  const MINIMO_DESCRICAO = 15;
  const MAXIMO_DESCRICAO = 300;

  const regras = {
    tipo: function (valor) {
      return valor === "" ? "Escolha o tipo do problema." : "";
    },
    bairro: function (valor) {
      return valor === "" ? "Escolha o bairro." : "";
    },
    descricao: function (valor) {
      if (valor === "") {
        return "Escreva uma descrição do problema.";
      }
      if (valor.length < MINIMO_DESCRICAO) {
        return "A descrição precisa ter pelo menos " + MINIMO_DESCRICAO +
          " caracteres. Você escreveu " + valor.length + ".";
      }
      if (valor.length > MAXIMO_DESCRICAO) {
        return "A descrição pode ter no máximo " + MAXIMO_DESCRICAO + " caracteres.";
      }
      return "";
    }
  };

  function mostrarErroDoCampo(campo, textoDoErro) {
    const areaDoErro = document.getElementById("erro-" + campo.name);

    if (textoDoErro) {
      campo.setAttribute("aria-invalid", "true");
      areaDoErro.textContent = textoDoErro;
      areaDoErro.hidden = false;
    } else {
      campo.removeAttribute("aria-invalid");
      areaDoErro.textContent = "";
      areaDoErro.hidden = true;
    }
  }

  function validarFormulario() {
    let primeiroCampoComErro = null;

    Object.keys(regras).forEach(function (nome) {
      const campo = formulario.elements[nome];
      const textoDoErro = regras[nome](campo.value.trim());

      mostrarErroDoCampo(campo, textoDoErro);

      if (textoDoErro && primeiroCampoComErro === null) {
        primeiroCampoComErro = campo;
      }
    });

    return primeiroCampoComErro;
  }

  function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem-formulario mensagem-" + tipo;
  }

  function gerarProximoId(lista) {
    let maiorId = 0;

    lista.forEach(function (ocorrencia) {
      if (Number(ocorrencia.id) > maiorId) {
        maiorId = Number(ocorrencia.id);
      }
    });

    return maiorId + 1;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campoComErro = validarFormulario();

    if (campoComErro) {
      mostrarMensagem("Corrija os campos marcados para registrar a ocorrência.", "erro");
      campoComErro.focus();
      return;
    }

    if (typeof ocorrencias === "undefined" || !Array.isArray(ocorrencias)) {
      mostrarMensagem("Não foi possível registrar agora porque a lista de ocorrências não carregou.", "erro");
      return;
    }

    const novaOcorrencia = {
      id: gerarProximoId(ocorrencias),
      tipo: formulario.elements.tipo.value,
      bairro: formulario.elements.bairro.value,
      descricao: formulario.elements.descricao.value.trim(),
      status: "Aberta",
      votos: 0
    };

    ocorrencias.push(novaOcorrencia);

    if (typeof renderizarOcorrencias === "function") {
      renderizarOcorrencias();
    }

    formulario.reset();
    mostrarMensagem(
      "Ocorrência nº " + novaOcorrencia.id + " registrada no bairro " + novaOcorrencia.bairro +
        ", com status Aberta. Ela começa com 0 apoios, por isso aparece no fim da lista.",
      "sucesso"
    );
  });

  function revalidarCampo(evento) {
    const campo = evento.target;

    if (regras[campo.name] && campo.getAttribute("aria-invalid") === "true") {
      mostrarErroDoCampo(campo, regras[campo.name](campo.value.trim()));
    }
  }

  formulario.addEventListener("input", revalidarCampo);
  formulario.addEventListener("change", revalidarCampo);
}

iniciarFormulario();

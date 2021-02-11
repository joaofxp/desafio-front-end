var inputItemQuantidade = "";
var inputItemQuantidadeAbreviatura = "";
var localStorageItens = "";
var itemSendoEditado = false;

// dps faz um objeto ajax config

var verificarItensCadastrados = function () {
    return JSON.parse(localStorage.getItem(localStorageItens));
};

var getItensCadastrados = function () {
    return JSON.parse(localStorage.getItem(localStorageItens));
};

var getElementoPorId = function (id) {
    return document.getElementById(id);
};

var getValorPorId = function (id) {
    return getElementoPorId(id).type === "checkbox"
        ? getElementoPorId(id).checked
            ? 1
            : 0
        : getElementoPorId(id).value;
};

var getValorDataFormatadoYYYYMMDD = function (data) {
    return new Date(data).toISOString().substr(0, 10);
};

var setValorPorId = function (id, valor) {
    return getElementoPorId(id).type === "checkbox"
        ? (getElementoPorId(id).checked = valor)
        : (getElementoPorId(id).value = valor);
};

var toggleDataValidadeObrigatoria = function () {
    if (getElementoPorId("dataValidade").required === false) {
        getElementoPorId("dataValidade").setAttribute("required", "required");
        getElementoPorId("dataValidadeText").innerText = "Data de validade *";
    } else {
        getElementoPorId("dataValidade").removeAttribute("required");
        getElementoPorId("dataValidadeText").innerText = "Data de validade";
    }
};

var limitarDataSuperiorFabricacao = function (valor) {
    getElementoPorId("dataFabricacao").setAttribute("max", valor);
};

var checarDataValidade = function (valor) {
    var dataValidadeSemHorario = formatarInputData(valor);

    var dataDeHojeSemHorario = new Date();

    var produtoVenceu = dataValidadeSemHorario < dataDeHojeSemHorario;

    if (produtoVenceu) {
        console.log("PRODUTO ESTA VENCIDO");
    }

    limitarDataSuperiorFabricacao(valor);
};

function formatarInputData(data) {
    return new Date(data + "T00:00");
}

var formatarTextoApenasLetrasComAcentos = function (texto) {
    var regexApenasLetrasEComAcentos = new RegExp("[^A-Za-zÀ-ÖØ-öø-ÿ]", "g");
    return texto.replace(regexApenasLetrasEComAcentos, "");
};

var validarNome = function (input) {
    input.value = formatarTextoApenasLetrasComAcentos(input.value);
};

var ativarBotaoItemQuantidade = function () {
    inputItemQuantidade.removeAttribute("disabled");
};

var setItemQuantidadeCasasDecimais = function (casas) {
    inputItemQuantidade.setAttribute("step", casas);
};

var setItemQuantidadeAbreviatura = function (texto) {
    inputItemQuantidadeAbreviatura.innerText = texto;
};

var resetValorQuantidadeDoItem = function () {
    inputItemQuantidade.value = "";
};

var carregarUnidadeDeMedida = function (valor) {
    var value = valor;
    var unidadesDeMedidaEnum = Object.freeze({
        LITRO: "litro",
        QUILOGRAMA: "quilograma",
        UNIDADE: "unidade",
    });
    var unidadesDeMedidaAbreviaturasEnum = Object.freeze({
        LITRO: "lt",
        QUILOGRAMA: "kg",
        UNIDADE: "un",
    });
    var unidadeDeMedida = value;
    ativarBotaoItemQuantidade();

    switch (unidadeDeMedida) {
        case unidadesDeMedidaEnum.LITRO:
            setItemQuantidadeCasasDecimais(".001");
            setItemQuantidadeAbreviatura(
                unidadesDeMedidaAbreviaturasEnum.LITRO
            );
            break;

        case unidadesDeMedidaEnum.QUILOGRAMA:
            setItemQuantidadeCasasDecimais(".001");
            setItemQuantidadeAbreviatura(
                unidadesDeMedidaAbreviaturasEnum.QUILOGRAMA
            );
            break;

        case unidadesDeMedidaEnum.UNIDADE:
            setItemQuantidadeCasasDecimais("1");
            setItemQuantidadeAbreviatura(
                unidadesDeMedidaAbreviaturasEnum.UNIDADE
            );
            break;

        default:
            break;
    }

    resetValorQuantidadeDoItem();
};

var formatarCampoMonetario = function formatarCampoMonetario() {
    $("#preco").mask("#.##0,00", {
        reverse: true,
    });
};

var urlParams = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
        window.location.href
    );

    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
};

var verificarSeEUmaEdicao = function () {
    if (urlParams("editarId") !== null) {
        if (!isNaN(urlParams("editarId")) && urlParams("editarId").length > 0) {
            var editarId = Number(urlParams("editarId"));
            itemSendoEditado = true;
            console.log(editarId);
            carregarInformacoesDoId(editarId);
        } else {
            alert("ID INVÁLIDO");
            redirecionarParaListagem();
        }
    } else {
        console.log("OUT");
    }
};

var carregarDadosDoItem = function (item) {
    var dataFabricacao = getValorDataFormatadoYYYYMMDD(item.dataFabricacao);

    var dataValidade = dataValida(new Date(item.dataValidade))
        ? getValorDataFormatadoYYYYMMDD(item.dataValidade)
        : "";

    carregarUnidadeDeMedida(item.unidadeDeMedida);
    ativarBotaoItemQuantidade();

    setValorPorId("edicaoId", item.id);
    setValorPorId("nomeDoItem", item.nomeDoItem);
    setValorPorId("unidadeDeMedida", item.unidadeDeMedida);
    setValorPorId("itemQuantidade", item.itemQuantidade);
    setValorPorId("preco", item.preco);
    setValorPorId("dataFabricacao", dataFabricacao);
    setValorPorId("dataValidade", dataValidade);
    setValorPorId("produtoPerecivel", item.produtoPerecivel);

    if (item.produtoPerecivel) {
        toggleDataValidadeObrigatoria();
    }

    checarDataValidade(dataValidade);
};

var redirecionarParaListagem = function () {
    location.href = "./index.html";
};

var carregarInformacoesDoId = function (id) {
    var itens = getItensCadastrados();

    var sofreuAlteracao = false;

    if (verificarItensCadastrados() === null) {
        alert("Operação inválida");
        return;
    }

    for (var contagem = 0; contagem < itens.length; contagem++) {
        var item = itens[contagem];

        if (item.id === id) {
            sofreuAlteracao = true;

            if (!Boolean(Number(item.itemAtivo))) {
                alert("Erro ao editar item, contate um administrador.");
                redirecionarParaListagem();

                return;
            }

            carregarDadosDoItem(item);
        }
    }

    if (!sofreuAlteracao) {
        alert("ID Inválido");
        redirecionarParaListagem();
        return;
    }
};

function dataValida(data) {
    return data instanceof Date && !isNaN(data);
}

var handleSubmit = function handleSubmit() {
    function salvarItensCadastrados(itens) {
        localStorage.setItem(localStorageItens, JSON.stringify(itens));
        console.log("ITENS ALTERADOS!");
        redirecionarParaListagem();
    }

    function criarItem(id) {
        console.log(
            dataValida(formatarInputData(getValorPorId("dataValidade")))
        );
        console.log(formatarInputData(getValorPorId("dataValidade")));

        var dataValidade = dataValida(
            formatarInputData(getValorPorId("dataValidade"))
        )
            ? formatarInputData(getValorPorId("dataValidade"))
            : "";

        return {
            id: id,
            nomeDoItem: getValorPorId("nomeDoItem"),
            unidadeDeMedida: getValorPorId("unidadeDeMedida"),
            itemQuantidade: getValorPorId("itemQuantidade"),
            preco: getValorPorId("preco"),
            dataFabricacao: formatarInputData(getValorPorId("dataFabricacao")),
            dataValidade: dataValidade,
            produtoPerecivel: getValorPorId("produtoPerecivel"),
            itemAtivo: "1",
        };
    }

    var id = 0;

    if (verificarItensCadastrados() === null) {
        var primeiroItem = criarItem(id);
        var itensArray = [primeiroItem];

        console.log("NOVO CADASTRO");

        salvarItensCadastrados(itensArray);
    } else {
        var itens = getItensCadastrados();
        id = itemSendoEditado ? getValorPorId("edicaoId") : itens.length;
        id = Number(id);

        var novoItem = criarItem(id);

        if (itemSendoEditado) {
            for (var contagem = 0; contagem < itens.length; contagem++) {
                var item = itens[contagem];

                if (item.id === id) {
                    itens[contagem] = novoItem;
                    console.log("ITEM EDITADO SALVO");

                    salvarItensCadastrados(itens);
                }
            }
        } else {
            console.log("ADD");
            itens.push(novoItem);
            salvarItensCadastrados(itens);
        }

        console.log("FIM DA CALL");
    }
};

window.addEventListener("load", function () {
    inputItemQuantidade = getElementoPorId("itemQuantidade");
    inputItemQuantidadeAbreviatura = getElementoPorId(
        "itemQuantidadeAbreviatura"
    );
    localStorageItens = "itens";

    var form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit();
    });

    verificarSeEUmaEdicao();
});

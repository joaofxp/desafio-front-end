// isola as funções de localstorage num arquivo só

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

var localStorageItens = "";

var getItensCadastrados = function () {
    return JSON.parse(localStorage.getItem(localStorageItens));
};

var getElementoPorId = function (id) {
    return document.getElementById(id);
};

var getValorDataFormatadoDDMMYYYY = function (data) {
    var dataParaFormatar = new Date(data);

    var diaFormatado = dataParaFormatar.getDate();
    diaFormatado = diaFormatado < 10 ? "0" + diaFormatado : diaFormatado;

    var mesFormatado = dataParaFormatar.getMonth() + 1;
    mesFormatado = mesFormatado < 10 ? "0" + mesFormatado : mesFormatado;

    var dataFormatada = "".concat(
        diaFormatado,
        "/",
        mesFormatado,
        "/",
        dataParaFormatar.getFullYear()
    );

    return dataFormatada;
};

var confirmarExclusao = function (id) {
    function salvarItensCadastrados(itens) {
        localStorage.setItem(localStorageItens, JSON.stringify(itens));
    }

    var confirmar = confirm(
        "Tem certeza que deseja excluir? Essa ação é irreversível."
    );

    if (confirmar) {
        var itens = getItensCadastrados();
        var sofreuAlteracao = false;

        for (var contagem = 0; contagem < itens.length; contagem++) {
            var item = itens[contagem];

            if (item.id === id) {
                sofreuAlteracao = true;
                var itemDesativado = item;
                itemDesativado.itemAtivo = 0;

                itens[contagem] = itemDesativado;

                salvarItensCadastrados(itens);
                console.log("ITEM DESATIVADO!");
                location.reload();

                break;
            }
        }

        if (!sofreuAlteracao) {
            alert("Erro ao excluir item, contate um administrador.");
        }
    }
};

var criarNovaLinhaDaTabela = function (item) {
    function removerTodosOsPontos(valor) {
        return valor.replace(/\./g, "");
    }

    function substituirPontoPorVirgulaUmaUnicaVez(valor) {
        return valor.replace(",", ".");
    }

    function formatarParaReal(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    var precoFormatado = item.preco;
    precoFormatado = removerTodosOsPontos(precoFormatado);
    precoFormatado = substituirPontoPorVirgulaUmaUnicaVez(precoFormatado);

    precoFormatado = formatarParaReal(precoFormatado);

    var urlEditar = "./cadastro.html?editarId=" + item.id;

    var dataFabricacao = getValorDataFormatadoDDMMYYYY(
        new Date(item.dataFabricacao)
    );

    var dataValidade =
        item.dataValidade === null || item.dataValidade.length === 0
            ? "Sem validade"
            : getValorDataFormatadoDDMMYYYY(new Date(item.dataValidade));

    var produtoPerecivel = item.produtoPerecivel ? "Sim" : "Não";

    var abreviatura = "";

    switch (item.unidadeDeMedida) {
        case unidadesDeMedidaEnum.LITRO:
            abreviatura = unidadesDeMedidaAbreviaturasEnum.LITRO;
            break;
        case unidadesDeMedidaEnum.QUILOGRAMA:
            abreviatura = unidadesDeMedidaAbreviaturasEnum.QUILOGRAMA;
            break;
        case unidadesDeMedidaEnum.UNIDADE:
            abreviatura = unidadesDeMedidaAbreviaturasEnum.UNIDADE;
            break;
        default:
            break;
    }

    return "".concat(
        "<tr>",

        "<td>",
        item.nomeDoItem,
        "</td>",

        "<td>",
        produtoPerecivel,
        "</td>",

        "<td  class='text-right'>",
        item.itemQuantidade + " " + abreviatura,
        "</td>",

        "<td  class='text-right'>",
        precoFormatado,
        "</td>",

        "<td  class='text-right'>",
        dataFabricacao,
        "</td>",

        "<td  class='text-right'>",
        dataValidade,
        "</td>",

        "<td class='text-center'>",

        "<button class='ml-auto btn btn-danger d-inline-block' onclick='confirmarExclusao(",
        item.id,
        ")'",
        ">",
        "Excluir",
        "</button>",

        "<a class='btn btn-warning d-inline-block ml-2' href='",
        urlEditar,
        "'>",
        "Editar",
        "</a>",

        "</td>",

        "</tr>"
    );
};

var carregarListagemDeItens = function () {
    var itens = getItensCadastrados();

    var itensListagemTabela = getElementoPorId("itens-listagem");

    for (var contagem = 0; contagem < itens.length; contagem++) {
        var item = itens[contagem];

        if (!Boolean(Number(item.itemAtivo))) {
            continue;
        }

        var novaLinha = criarNovaLinhaDaTabela(item);

        itensListagemTabela.innerHTML += novaLinha;
    }
};

window.addEventListener("load", function () {
    localStorageItens = "itens";

    carregarListagemDeItens();
});

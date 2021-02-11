// isola as funções de localstorage num arquivo só

var localStorageItens = "";

var getItensCadastrados = function () {
    return JSON.parse(localStorage.getItem(localStorageItens));
};

var getElementoPorId = function (id) {
    return document.getElementById(id);
};

var getValorDataFormatadoDDMMYYYY = function (data) {
    var dataParaFormatar = new Date(data);

    var mesFormatado = dataParaFormatar.getMonth() + 1;
    mesFormatado = mesFormatado < 10 ? "0" + mesFormatado : mesFormatado;

    var dataFormatada = "".concat(
        dataParaFormatar.getDate(),
        "/",
        mesFormatado,
        "/",
        dataParaFormatar.getFullYear()
    );

    return dataFormatada;
};

var criarNovaLinhaDaTabela = function (item) {
    var precoFormatado = item.preco.replace(",", ".");

    precoFormatado = Number(precoFormatado).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    console.log(precoFormatado);

    return "".concat(
        "<tr>",

        "<td>",
        item.nomeDoItem,
        "</td>",

        "<td>",
        item.unidadeDeMedida,
        "</td>",

        "<td>",
        item.itemQuantidade,
        "</td>",

        "<td>",
        precoFormatado,
        "</td>",

        "<td>",
        getValorDataFormatadoDDMMYYYY(item.dataFabricacao),
        "</td>",

        "<td>",
        getValorDataFormatadoDDMMYYYY(item.dataValidade),
        "</td>",

        "<td>",
        item.produtoPerecivel,
        "</td>",

        "</tr>"
    );
};

var carregarListagemDeItens = function () {
    var itens = getItensCadastrados();

    var itensListagemTabela = getElementoPorId("itens-listagem");

    for (var contagem = 0; contagem < itens.length; contagem++) {
        var item = itens[contagem];

        var novaLinha = criarNovaLinhaDaTabela(item);

        itensListagemTabela.innerHTML += novaLinha;
    }
};

window.addEventListener("load", function () {
    localStorageItens = "itens";

    carregarListagemDeItens();
});

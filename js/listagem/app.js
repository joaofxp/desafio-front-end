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

                console.log("EXCLUIR", id);

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
    var precoFormatado = item.preco;
    //Remover todos pontos
    precoFormatado = precoFormatado.replace(/\./g, "");
    //Só altera a ultima virgula para ponto, permitindo a formatação
    precoFormatado = precoFormatado.replace(",", ".");

    precoFormatado = Number(precoFormatado).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    var urlEditar = "./cadastro?editarId=" + item.id;

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

        "<td>",

        "<button onclick='confirmarExclusao(",
        item.id,
        ")'",
        ">",
        "Excluir",
        "</button>",

        "<a href='",
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

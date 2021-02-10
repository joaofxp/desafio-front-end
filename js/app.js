const inputItemQuantidade = document.getElementById("itemQuantidade");
const inputItemQuantidadeAbreviatura = document.getElementById(
    "itemQuantidadeAbreviatura"
);

const formatarTextoApenasLetrasComAcentos = (texto) => {
    const regexApenasLetrasEComAcentos = new RegExp("[^A-Za-zÀ-ÖØ-öø-ÿ]", "g");

    return texto.replace(regexApenasLetrasEComAcentos, "");
};

const validarNome = (input) => {
    input.value = formatarTextoApenasLetrasComAcentos(input.value);
};

const ativarBotaoItemQuantidade = (casas) => {
    inputItemQuantidade.removeAttribute("disabled");
};

const setItemQuantidadeCasasDecimais = (casas) => {
    inputItemQuantidade.setAttribute("step", casas);
};

const setItemQuantidadeAbreviatura = (texto) => {
    inputItemQuantidadeAbreviatura.innerText = texto;
};

const resetValorQuantidadeDoItem = () => {
    inputItemQuantidade.value = 0;
};

const carregarUnidadeDeMedida = ({ value }) => {
    const unidadesDeMedidaEnum = Object.freeze({
        LITRO: "litro",
        QUILOGRAMA: "quilograma",
        UNIDADE: "unidade",
    });

    const unidadesDeMedidaAbreviaturasEnum = Object.freeze({
        LITRO: "lt",
        QUILOGRAMA: "kg",
        UNIDADE: "un",
    });

    const unidadeDeMedida = value;

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

const formatarCampoMonetario = (input) => {
    const valorInicial = "0,00";

    var valor = input.value;

    // if (input.value === valorInicial) return;

    const regexApenasLetrasEComAcentos = new RegExp("[^A-Za-zÀ-ÖØ-öø-ÿ]", "g");

    valor = valor + "";
    valor = parseInt(valor.replace(/[\D]+/g, ""));
    valor = valor + "";
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        //FORMATAR PARA MILHAR E CENTAVOS
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    input.value = valor;
    if (valor == "NaN") input.value = "0,00";
};

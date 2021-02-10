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

const ativarBotaoItemQuantidade = () => {
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

const formatarCampoMonetario = (
    input,
    separadorMilesimo,
    separadorDecimal,
    evento
) => {
    let teclaPressionada = "",
        contagem = 0,
        inputTamanho = 0,
        separadorAuxiliar = "",
        valorReverso = "",
        teclaPressionadaKeyCode = window.Event ? evento.which : evento.keyCode;

    //Caso seja a tecla de backspace ou enter, não faz nada além de apagar o input
    if (13 === teclaPressionadaKeyCode || 8 === teclaPressionadaKeyCode)
        return !0;

    // console.log(String.fromCharCode(teclaPressionadaKeyCode)); //retorna uma string a partir do código da tecla pressionada
    // console.log(
    //     "0123456789".indexOf(String.fromCharCode(teclaPressionadaKeyCode))
    // ); //confere se o que foi pressionado é um numero
    //se não for, não realiza nenhum alteração

    //((CHECA SE A TECLA PRESSIONADA NÃO É UM NÚMERO))
    if (
        ((teclaPressionada = String.fromCharCode(teclaPressionadaKeyCode)),
        -1 === "0123456789".indexOf(teclaPressionada))
    )
        return !1;

    for (
        inputTamanho = input.value.length, contagem = 0;
        contagem < inputTamanho &&
        ("0" === input.value.charAt(contagem) ||
            input.value.charAt(contagem) === separadorDecimal);
        contagem++
    );

    for (separadorAuxiliar = ""; contagem < inputTamanho; contagem++)
        -1 != "0123456789".indexOf(input.value.charAt(contagem)) &&
            (separadorAuxiliar += input.value.charAt(contagem));

    if (
        ((separadorAuxiliar += teclaPressionada),
        0 === (inputTamanho = separadorAuxiliar.length) && (input.value = ""),
        1 === inputTamanho &&
            (input.value = "0" + separadorDecimal + "0" + separadorAuxiliar),
        2 === inputTamanho &&
            (input.value = "0" + separadorDecimal + separadorAuxiliar),
        inputTamanho > 2)
    ) {
        for (
            valorReverso = "", j = 0, contagem = inputTamanho - 3;
            contagem >= 0;
            contagem--
        ) {
            3 === j && ((valorReverso += separadorMilesimo), (j = 0)),
                (valorReverso += separadorAuxiliar.charAt(contagem)),
                j++;
        }

        for (
            input.value = "", contagem = valorReverso.length - 1;
            contagem >= 0;
            contagem--
        ) {
            input.value += valorReverso.charAt(contagem);
        }

        input.value +=
            separadorDecimal +
            separadorAuxiliar.substr(inputTamanho - 2, inputTamanho);
    }

    return !1;

    //bug se tentar alterar numero no inicio, está inserindo no final
};

const handleSubmit = (evento) => {
    console.log("HANDLE");
    evento.preventDefault();
};

// $(document).ready(function () {
// $("#preco").on("change", function () {
// console.log("CALL");
// $("#preco").mask("#.##0,00", { reverse: true });
// });
// });

// console.log("LOAD");

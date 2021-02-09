formatarTextoApenasLetrasComAcentos = (texto) => {
    const regexApenasLetrasEComAcentos = new RegExp("[^A-Za-zÀ-ÖØ-öø-ÿ]", "g");

    return texto.replace(regexApenasLetrasEComAcentos, "");
};

validarNome = (input) => {
    input.value = formatarTextoApenasLetrasComAcentos(input.value);
};

carregarUnidadesDeMedida = ({ value }) => {
    const unidadesDeMedidaEnum = Object.freeze({
        LITRO: "litro",
        QUILOGRAMA: "quilograma",
        UNIDADE: "unidade",
    });

    const unidadeDeMedida = value;

    switch (unidadeDeMedida) {
        case unidadesDeMedidaEnum.LITRO:
            console.log("unidadesDeMedidaEnum.LITRO");
            document
                .getElementById("itemQuantidade")
                .removeAttribute("disabled");

            document
                .getElementById("itemQuantidade")
                .setAttribute("step", ".001");

            document.getElementById("itemQuantidade").innerText = "lt";

            break;
        case unidadesDeMedidaEnum.QUILOGRAMA:
            console.log("unidadesDeMedidaEnum.QUILOGRAMA");
            break;
        case unidadesDeMedidaEnum.UNIDADE:
            console.log("unidadesDeMedidaEnum.UNIDADE");
            break;
        default:
            console.log("NADA");
            break;
    }
};

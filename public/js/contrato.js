
let response = null


function getDataFunction() {

    hiddenAll()

    const smartContract = document.getElementById("inputSelectContract").value

    if (!smartContract)
        return alert("Selecione um contrato")

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://127.0.0.1:3000/smart-contract/function/${smartContract}`, options)
        .then(res => res.json())
        .then(res => { response = res; showFunctions() })
        .catch(err => console.error(err.message));


}

function showFunctions() {

    const select = document.getElementById('inputSelectFunction');
    select.innerHTML = '<option value="" selected>Selecione uma função</option>';

    // Adicionar as opções obtidas da API
    response.forEach((func, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = func.description;
        select.appendChild(option);
    });

    document.getElementById('selectFunction').hidden = false;
}

function showInputs() {

    const inputParent = document.getElementById('inputTextFunction');

    inputParent.innerHTML = ""

    const select = parseInt(document.getElementById('inputSelectFunction').value);

    if (select >= 0)
        response[select].inputs.forEach(input => addInput(inputParent, 'text', `${input.name} (${input.type})`));

    document.getElementById('inputTextFunction').hidden = false;

}

// Crie uma função para adicionar os inputs
function addInput(inputParent, type, placeholder) {

    // Crie os elementos <div> e <input>
    const div = document.createElement('div');
    div.className = 'input-group mb-3';
    const input = document.createElement('input');
    input.type = type;
    input.className = 'form-control contract-params';
    input.placeholder = placeholder;
    input.required = true;

    // Adicione o <input> à <div>
    div.appendChild(input);

    // Adicione a <div> ao elemento pai
    inputParent.appendChild(div);
}

function hiddenAll() {
    document.getElementById('selectFunction').hidden = true;
    document.getElementById('inputTextFunction').hidden = true;
    document.getElementById("responseArea").hidden = true;
}

function executeContract(e) {
    e.preventDefault()
    const local = document.querySelector('div#modalcontrato input[name="local"]:checked').value;
    const horario = document.querySelector('div#modalcontrato input[name="horario"]:checked').value;

    const functionId = document.querySelector("div#modalcontrato #inputSelectFunction").value
    const functionName = response[functionId].name
    const contractParams = new Array(...document.querySelectorAll("div#modalcontrato .contract-params")).map(x => x.value)

    const dispSeguranca = new Array(...document.querySelectorAll('div#modalcontrato .dispSeguranca')).filter(x => x.checked).map(x => x.value)

    const user_name = localStorage.getItem("user_name");
    const user_address = localStorage.getItem("user_address");
    const user_agencia = localStorage.getItem("user_agencia");
    const user_tipo_conta = localStorage.getItem("user_tipo_conta");
    const user_num_conta = localStorage.getItem("user_num_conta");

    const tipo_operador = localStorage.getItem("tipo_operador");
    const papel = localStorage.getItem("papel");
    const autenticacao = localStorage.getItem("autenticacao");
    const aprovacao = localStorage.getItem("aprovacao");

    const responseArea = document.getElementById("responseArea")
    responseArea.innerHTML = "<h7>Requisição: </h7>"
    responseArea.hidden = false;

    console.log({
        usuario: {
            nome: user_name,
            // address: user_address,
            agencia: user_agencia,
            // tipo_conta: user_tipo_conta,
            num_conta: user_num_conta,
        }, contexto: {
            local, horario, dispSeguranca,
        },
        transacao: {
            tipo: "contrato",
            endereco_contrato: "0x8765407643216bB75C7945F3E842D00030999233",
            params: contractParams,
            function: functionName
        }
    })

    responseArea.appendChild(new JSONFormatter({
        conta_origem: {
            nome: user_name,
            // address: user_address,
            agencia: user_agencia,
            num_conta: user_num_conta,
        }, operador: {
            tipo_operador,
            papel: papel.split(','),
            autenticacao,
            aprovacao: dispSeguranca
        },
        operacao: {
            produto: "contrato",
            local,
            horaInicioOp: horario == "dia" ? { "hora": 13, "minuto": 0 } : { "hora": 23, "minuto": 0 },
            endereco_contrato: "0x8765407643216bB75C7945F3E842D00030999233",
            params: contractParams,
            function: functionName
        }
    }).render())

    // const options = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         usuario: localStorage.getItem("user_name"),
    //         usuarioAddress: localStorage.getItem("user_address"),
    //         local,
    //         horario,
    //         account_to_connect: "0x232DC4c91437D7d4d5BA87442289639f3190C50c",
    //         function: functionName,
    //         params: contractParams,
    //         dispSeguranca
    //     })
    // };

    // console.log({
    //     usuario: localStorage.getItem("user_name"),
    //     usuarioAddress: localStorage.getItem("user_address"),
    //     local,
    //     horario,
    //     functionName,
    //     contractParams,
    //     dispSeguranca
    // })

    // fetch(`http://127.0.0.1:3000/smart-contract/`, options)
    //     .then(res => res.json())
    //     .then(res => { console.log(res); responseArea.appendChild(new JSONFormatter(res).render()) })
    //     .catch(err => console.error(err.message));


}

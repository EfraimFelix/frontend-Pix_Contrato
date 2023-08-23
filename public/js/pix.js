
function executePix(e) {
    e.preventDefault()

    const local = document.getElementById('pix-local').value;
    const horario = document.getElementById('pix-horario').value;
    const destino = document.getElementById('pix-destino').value;
    const tempoCadastro = document.getElementById('pix-tempo').value;
    const numAprovadores = document.getElementById('pix-naprovadores').value;
    const scoreDestino = document.getElementById('pix-score').value
    let dispSeguranca = new Array(...document.querySelectorAll('div#modalpix .dispSeguranca1')).filter(x => x.value).map(x => x.value)
    dispSeguranca = [...dispSeguranca, ...new Array(...document.querySelectorAll('div#modalpix .dispSeguranca2')).filter(x => x.checked).map(x => x.value)]

    const tipoOperacao = document.getElementById("pix-operacao").value
    const valor = document.querySelector("div#modalpix #pix-valor").value

    const user_name = localStorage.getItem("user_name");
    const user_agencia = localStorage.getItem("user_agencia");
    const user_num_conta = localStorage.getItem("user_num_conta");

    const tipo_operador = localStorage.getItem("tipo_operador");
    const papel = localStorage.getItem("papel");
    const autenticacao = localStorage.getItem("autenticacao");

    if (!tipoOperacao) {
        alert('Selecione uma operação')
        return
    }

    if (!local) {
        alert('Seleciona um contexto')
        return
    }

    const requestArea = document.getElementById("requestAreaPix")
    requestArea.innerHTML = "<h6>Requisição: </h6>"
    requestArea.hidden = false;

    const responseArea = document.getElementById("responseAreaPix")
    responseArea.innerHTML = '<h6>Resposta: <b id="responseMessagePix"></b> </h6>'
    responseArea.hidden = false;

    const request = {
        conta_origem: {
            usuario: user_name,
            agencia: parseInt(user_agencia) | 0,
            cc: parseInt(user_num_conta) | 0,
        },
        operador: {
            tipo_operador,
            papel: papel.split(','),
            autenticacao,
            aprovacao: dispSeguranca
        }, operacao: {
            produto: "PIX",
            tipo: tipoOperacao,
            valor: parseInt(valor) | 0,
            aprovacoes: parseInt(numAprovadores) | 0,
            somaOperacoesDia: 0,
            local,
            tipoDestino: destino,
            tempoCadastroDestino: parseInt(tempoCadastro) | 0,
            nivelConfiancaDestino: parseInt(scoreDestino) | 0,
            horaInicioOp: horario == "dia" ? { "hora": 13, "minuto": 0 } : { "hora": 23, "minuto": 0 }
        }
    }

    requestArea.appendChild(new JSONFormatter(request).render())

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    };

    fetch("http://localhost:8080/pix", options)
        .then(res => res.json())
        .then(res => {
            responseArea.appendChild(new JSONFormatter(res.result).render());
            document.getElementById("responseMessagePix").innerHTML = res.Autorizacao;
            closeJSONObjects()
        })
        .catch(err => console.log(err));

}

function cadastroSelected(radio) {
    const inputReadOnly = document.getElementById('tempoCadastrado');

    if (radio.value === 'naoCadastrado') {
        inputReadOnly.readOnly = true;
        inputReadOnly.value = '0';
    } else {
        inputReadOnly.readOnly = false;
    }
}

function closeJSONObjects() {
    var botoes = document.querySelectorAll(".json-formatter-toggler-link");
    botoes.forEach(function (botao) {
        var evento = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        botao.dispatchEvent(evento);
    });
}

function displayContextoPix() {
    const listaContexto = document.querySelector('#modalpix #contexto')
    listaContexto.innerHTML = ""

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();

    request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const item = cursor.value;

            if (item.produto === "Pix") {

                const label = document.createElement("label")
                label.className = "btn btn-secondary"
                label.innerHTML = item.nomeContexto
                label.setAttribute("onclick", `setAttrContexto(${item.id})`)

                const input = document.createElement("input")
                input.setAttribute("type", "radio")
                input.setAttribute("name", "contextoOptions")

                label.appendChild(input)

                listaContexto.appendChild(label);
            }

            cursor.continue();
        }
    };
}

function setAttrContexto(id) {

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event) => {
        const item = event.target.result;

        document.getElementById('pix-local').value = item.local
        document.getElementById('pix-horario').value = item.horario
        document.getElementById('pix-destino').value = item.destino
        document.getElementById('pix-tempo').value = item.tempoCadastro
        document.getElementById('pix-naprovadores').value = item.numAprovadores
        document.getElementById('pix-score').value = item.scoreDestino

    }

}
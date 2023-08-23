function excluirItem(button) {
    var listItem = button.closest('.list-group-item');
    listItem.remove();
}

function editarItem(button) {
    var listItem = button.closest('.list-group-item');
    var itemName = listItem.querySelector('strong').textContent.trim();
    var newItemName = prompt('Editar item:', itemName);
    if (newItemName !== null && newItemName.trim() !== '') {
        listItem.querySelector('strong').textContent = newItemName;
    }
}

function addItemToStore(jsonItem) {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(jsonItem);

    request.onsuccess = function (event) {
        console.log('Item salvo com ID:', event.target.result);
        displayItems();
    };

    request.onerror = function (event) {
        console.error('Erro ao salvar o item', event.target.error);
    };
}

function updateItemInStore(item) {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = function (event) {
        console.log('Item atualizado com sucesso');
        displayItems();
    };

    request.onerror = function (event) {
        console.error('Erro ao atualizar o item', event.target.error);
    };
}

function deleteItemFromStore(id) {
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = function (event) {
        console.log('Item excluído com sucesso');
        displayItems();
    };

    request.onerror = function (event) {
        console.error('Erro ao excluir o item', event.target.error);
    };
}

function displayItems(filter = null) {
    const itemList = document.querySelector('#modalcontexto ul');
    itemList.innerHTML = '';

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();

    request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const item = cursor.value;
            if (!filter || item.produto === filter) {
                const listItem = document.createElement('li');

                listItem.className = 'list-group-item d-flex justify-content-between align-items-center'
                listItem.innerHTML = `<div><strong>${item.nomeContexto}</strong><small class="ml-2 text-muted">${item.produto}</small></div>`

                const buttonGroup = document.createElement('div');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.className = 'btn btn-danger btn-sm mr-2'
                deleteButton.setAttribute('onclick', `deleteItemFromStore(${item.id});`)

                // const editButton = document.createElement('button');
                // editButton.textContent = 'Editar';
                // editButton.className = 'btn btn-primary btn-sm'
                // // editButton.addEventListener('click', function () {
                // //     const newName = prompt('Editar nome:', item.name);
                // //     if (newName !== null) {
                // //         item.name = newName;
                // //         updateItemInStore(item);
                // //     }
                // // });

                buttonGroup.appendChild(deleteButton);
                // buttonGroup.appendChild(editButton);
                listItem.appendChild(buttonGroup);

                itemList.appendChild(listItem);
            }

            cursor.continue();
        }
    };
}

function addContexto() {
    const produto = document.querySelector('#addItemModal #produto').value;

    const local = document.querySelector('#addItemModal input[name="local"]:checked').value;
    const horario = document.querySelector('#addItemModal input[name="horario"]:checked').value;
    const destino = document.querySelector('#addItemModal input[name="destino"]:checked').value;
    const tempoCadastro = document.querySelector('#addItemModal #tempoCadastrado').value;
    const numAprovadores = document.querySelector('#addItemModal #numeroAprovadores').value;
    const scoreDestino = document.querySelector("#addItemModal #nivelConfianca").value

    const nomeContexto = document.querySelector("#addItemModal #nomeContexto").value

    const newItem = { nomeContexto, produto, local, horario, destino, tempoCadastro, numAprovadores, scoreDestino };

    addItemToStore(newItem);
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
const DB_NAME = 'contextosDB';
const DB_VERSION = 1;
const STORE_NAME = 'contextos';

let db;

const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onerror = function (event) {
    console.error('Erro ao abrir o banco de dados', event.target.error);
};
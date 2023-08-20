const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // Porta em que o servidor vai rodar

app.use(cors())

// Define a pasta "public" como o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

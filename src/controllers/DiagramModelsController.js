const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
const db = require("../database");
const { handleExceptions } = require('../helpers');
const fs = require('fs');
const path = require('path');

const diagramasjsonPath = path.join(__dirname, '../public/diagramModels/ModelosDiagramas.json'); // Caminho absoluto para o arquivo JSON

module.exports = {
    // Get ALL
    getAll: {
        handler: async (req, res) => {
            try {
                // Verifica se o arquivo existe antes de tentar ler
                if (!fs.existsSync(diagramasjsonPath)) {
                    return res.status(404).json({ error: 'Arquivo de diagramas não encontrado.' });
                }

                // Lê o conteúdo do arquivo JSON
                const diagramasData = fs.readFileSync(diagramasjsonPath, 'utf-8');
                const diagramas = JSON.parse(diagramasData); // Converte de volta para objeto JavaScript

                // Retorna os diagramas lidos do arquivo
                return res.json({ diagrams: diagramas });

            } catch (error) {
                return handleExceptions(error, res);
            }
        }
    },

    // Remover
    // Implementação de método para remoção de diagramas (se necessário)
    remove: {
    }
};

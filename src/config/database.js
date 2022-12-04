require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialectOptions: {
        dateStrings: true,
        typeCast: function (field, next) { // ler do banco datetime em string
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        },
    },
    define: {
        timestamps: true, //Habilitar created_at, updated_at
        underscored: true, // Atributos em snake case
        freezeTableName: false // Nome da tabela igual ao nome do model
    }
}
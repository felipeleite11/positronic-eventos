require('dotenv').config()

module.exports = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    },
    timezone: '+00:00'
}

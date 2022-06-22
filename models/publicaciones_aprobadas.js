const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/config.js");

const PublicacionesAprobadas = sequelize.define("publicaciones_aprobadas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_publicacion: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_administrador: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = PublicacionesAprobadas;
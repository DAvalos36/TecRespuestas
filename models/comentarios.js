const {Sequelize,DataTypes } = require("sequelize");
const sequelize = require("../db/config.js");

const Comentarios = sequelize.define("comentarios", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correcto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    id_propietario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Comentarios;
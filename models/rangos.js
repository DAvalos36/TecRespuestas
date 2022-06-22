const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/config.js");

const Rangos = sequelize.define("rangos", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Rangos.create({ id: 1, nombre: "Usuario" });
Rangos.create({ id: 2, nombre: "Administrador" });




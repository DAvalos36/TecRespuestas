const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/config.js");
const Publicaciones = require("./publicaciones.js");
const PublicacionesAprobadas = require("./publicaciones_aprobadas.js");
const Rangos = require("./rangos.js");

const Usuarios = sequelize.define("usuarios", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rango: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    acceso: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

Usuarios.hasMany(Publicaciones, { foreignKey: "id_propietario", sourceKey: "id" });
Publicaciones.belongsTo(Usuarios, { foreignKey: "id_propietario", targetKey: "id" });
Usuarios.hasMany(PublicacionesAprobadas, { foreignKey: "id_administrador", sourceKey: "id" });
PublicacionesAprobadas.belongsTo(Usuarios, { foreignKey: "id_administrador", targetKey: "id" });
Usuarios.belongsTo(Rangos, { foreignKey: "rango", targetKey: "id" });
Rangos.hasOne(Usuarios, { foreignKey: "rango", sourceKey: "id" });

module.exports = Usuarios;
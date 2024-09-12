import { DataTypes } from 'sequelize'
import db from '../config/db.js'


const productos = db.define('productos1',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    imagen:{
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export default productos
import { DataTypes } from 'sequelize'
import db from '../config/db.js'


const precio = db.define('precios',{
    nombre:{
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

export default precio
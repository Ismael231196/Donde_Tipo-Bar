import Sequelize  from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '',{
    host: process.env.BD_HOST, 
    port: 3306,
    dialect: 'mysql',
    define:{
        timestamp:true //es para que si un usuario se registra agrega dos cuadros mas uno va a decir cuando fue creado y el otro cuando fue actualizado
    },
    pool:{  //conexion pool las bases de datos es algo que consumen muchos recursos
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
})

export default db;
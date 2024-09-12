//const express = require('express')
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuatioRoutes.js'
import dondetipoRoutes from './routes/dondetipoRoutes.js'
import appRoutes from './routes/appRoutes.js'
import db from './config/db.js'

//crear la app
const app = express()

//habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

//Habilitar Cookie parser
app.use( cookieParser())

//Habilitar CSRF
app.use(csrf({ cookie: true }));


// conexión a la base de datos

    await db.authenticate() //authenticate es un metodo de siquialice
    db.sync()
    
    console.log('conexion correcta a la base de datos');
    
// habilitar pug
app.set('view engine', 'pug') // set para la configuracion
app.set('views', './views')

// carpeta publica
app.use(express.static('public'))
//routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes) //use para las rutas
app.use('/', dondetipoRoutes)


//definir un puerto y arrancar el proyecto
const port= process.env.PORT || 3000;

app.listen(port, () =>{ //un aronfucion es () =>
    console.log(`el puerto esta funcionando en el puerto ${port}`);
    
})
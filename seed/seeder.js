import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { categoria, precio, Usuario} from '../models/index.js'

const importarDatos = async () => {
try {
    // Autenticar
    await db.authenticate();
    // Generar las Columnas
    await db.sync();

    // Insertamos los Datos
    await Promise.all([
        categoria.bulkCreate(categorias),
        precio.bulkCreate(precios),
        Usuario.bulkCreate(usuarios)
    ]);
    console.log("Datos importados correctamente");
    exit(0);
} catch (error) {
    console.log(error);
    exit(1);
}
};

const eliminarDatos = async () =>{
    try{

        await db.sync({force: true})
        
        console.log('Datos eliminados correctamente');
        exit(0)
        
    }catch (error){
        console.log(error);
        exit(1);
    }
    
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}

import express from 'express';
import { body } from 'express-validator';
import { admin,crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar,cambiarEstado, mostrarProducto, enviarMensaje, verMensajes, inicio } from '../controllers/dondetipoControllers.js';
import protegerRutas from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

router.get('/mis-productos', protegerRutas, admin); // Productos 
router.get('/productos/crear', protegerRutas, crear);
router.post('/productos/crear', protegerRutas,
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('descripcion')
    .notEmpty().withMessage('La descripcion no puede ir vacia')
    .isLength({max: 500}).withMessage('La Descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('No puede ir vacio el precio'),
    guardar
);

router.get('/productos/agregar-imagen/:id', 
    protegerRutas,
    agregarImagen
)

router.post('/productos/agregar-imagen/:id', 
    protegerRutas,
    upload.single('imagen'),
    almacenarImagen
);  

router.get('/productos/editar/:id', 
    protegerRutas,
    editar
)

router.post('/productos/editar/:id', protegerRutas,
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('descripcion')
    .notEmpty().withMessage('La descripcion no puede ir vacia')
    .isLength({max: 800}).withMessage('La Descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('No puede ir vacio el precio'),
    guardarCambios
)

router.post('/productos/eliminar/:id',
    protegerRutas,
    eliminar
)

router.put('/productos/:id',
    protegerRutas,
    cambiarEstado
)

//Area publica 
router.get('/productos/:id',
    identificarUsuario,
    mostrarProducto
)

//Almacenar los mensajes
router.post('/productos/:id',
    identificarUsuario,
    body('mensaje').isLength({ min: 20 }).withMessage('El mensaje no puede ir vacío o es muy corto'),
    enviarMensaje
);

router.get('/mensajes/:id',
    protegerRutas,
    verMensajes
)


router.get('/inicio1/index1', inicio)

export default router;

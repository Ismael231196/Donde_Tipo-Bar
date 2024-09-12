import express from 'express';
import { formulariologin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioControllers.js';

const router = express.Router();

router.get('/login', formulariologin) //priemer enpoint
router.post('/login', autenticar)

//Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registros', formularioRegistro)
router.post('/registros', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

export default router
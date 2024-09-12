import express from 'express';
import {inicio, Categoria, noEncontrado, buscador} from '../controllers/appController.js';

const router = express.Router();

// Página de inicio
router.get('/', inicio);

// Categorías
router.get('/categorias/:id', Categoria);

// Página 404
router.get('/404', noEncontrado);

// Buscador
router.post('/buscador', buscador);

export default router;

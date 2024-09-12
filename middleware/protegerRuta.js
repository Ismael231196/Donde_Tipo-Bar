import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const protegerRutas = async (req, res, next) => {
  // Verificar si hay un token
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect('/auth/login');
  }

  // Comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);
    console.log('Usuario encontrado:', usuario);
    
    if (usuario) {
      req.usuario = usuario;
    } else {
      return res.redirect('/auth/login');
    }
  
    return next();
  
  } catch (error) {
    console.error('Error en protegerRutas:', error);
    return res.clearCookie('_token').redirect('/auth/login');
  }
  
};

export default protegerRutas;

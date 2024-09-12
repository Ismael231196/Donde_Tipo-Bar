import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const identificarUsuario = async (req, res, next) => {
    // Identificar si hay un token
    const {_token} = req.cookies;
    if (!_token) {
        req.usuario = null;
        return next();
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        if (usuario) {
            req.usuario = usuario;
        }

        return next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        res.clearCookie('_token').redirect('/auth/login');
    }
};

export default identificarUsuario;

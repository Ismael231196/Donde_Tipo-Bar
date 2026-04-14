import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre}, process.env.JWT_SECRET, {expiresIn: '1d'})
const generarId = () => crypto.randomBytes(32).toString('hex');

export{
    generarJWT,
    generarId
}
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import Usuario from '../models/Usuario.js';
import {generarJWT, generarId} from '../helpers/tokens.js'
import { emailRegistro, emailOlvidepassword } from '../helpers/email.js'



const formulariologin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async(req, res) => {
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado = validationResult(req)

        //verificar que el resultado este vacio
        if(!resultado.isEmpty()){
            //errores
            return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
            })
        }
        const {email, password} = req.body
        //comprobar si el usuario existe
        const usuario = await Usuario.findOne({where:{email}})
        if(!usuario){
            return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
                })
        }
        //Comprobar si el usuario esta confirmado
        if(!usuario.confirmado){
            return res.render('auth/login',{
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu Cuenta no ha sido confirmada'}]
                })
        }
        //Revisar el password
        
            if (!usuario.verificarPassword(req.body.password)) {
                return res.render('auth/login', {
                    pagina: 'Iniciar sesión',
                    csrfToken: req.csrfToken(),
                    errores: [{ msg: 'El password es incorrecto' }]
                });
            }
        //Autenticar al usuario
        const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
        console.log(token)

        //Almacenar en un cooke
        return res.cookie('_token', token,{
            httpOnly:true,
            
        }).redirect('/mis-productos')
            
            
        
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {
    
    res.render('auth/registros',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
        //validacion
        await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
        await check('email').isEmail().withMessage('Eso no parece un email').run(req)
        await check('Password').isLength({min: 6}).withMessage('El password debe de ser de al menos 6 caracteres').run(req)
        //await check('repetir_Password').equals('Password').withMessage('los password no son iguales').run(req)
        await check('repetir_password').custom((value, { req }) => value === req.body.Password).withMessage('Los passwords no son iguales').run(req);

        
        
        let resultado = validationResult(req)

        // return res.json(resultado.array())
        //varificar que el resultado este vacio
        if(!resultado.isEmpty()){
            return res.render('auth/registros',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
            })
        }

        //Extraer los datos
        const {nombre, email, Password} = req.body

        //varificar que el usuario no este duplicado
        const existeUsario = await Usuario.findOne({where: {email}})
        if(existeUsario){
            return res.render('auth/registros',{
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'El usuario ya esta registrado'}],
                usuario:{
                    nombre: req.body.nombre,
                    email: req.body.email
                }
                })
        }
        //Almacenar un usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            Password, // Este debe ser el valor de `req.body.password`
            token: generarId()
        })

        //envia email de confirmacion
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })

        //Mostrar mensaje de confirmacion
        res.render('auth/mensaje',{
            pagina: 'pagina creada Correctamente',
            mensaje: 'Hemos Enviado Un Mensaje De Confirmacion, Preciona En El Enlace'

        })
}

//funcion que  comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    try {
        const usuario = await Usuario.findOne({ where: { token } });

        if (!usuario) {
            return res.render('auth/confirmar-cuenta', {
                pagina: 'Error al confirmar tu cuenta',
                mensaje: 'El token no es válido o ya ha sido confirmado',
                error: true
            });
        }

        // Si se encuentra el usuario, actualiza el token y la confirmación
        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();

        res.render('auth/confirmar-cuenta', {
            pagina: 'Cuenta Confirmada',
            mensaje: 'La cuenta se confirmó correctamente',
            error: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a Donde Tipo',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
        
        let resultado = validationResult(req)

        //varificar que el resultado este vacio
        if(!resultado.isEmpty()){
            //Errores
            return res.render('auth/olvide-password',{
                pagina: 'Recupera tu acceso a Donde Tipo',
                csrfToken: req.csrfToken(),
                errores: resultado.array()
            })
        }
        //Buscar el usuario
        const{email} = req.body

        const usuario = await Usuario.findOne({where: {email}})
        if(!usuario){
            return res.render('auth/olvide-password',{
                pagina: 'Recupera tu acceso a Donde Tipo',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'El Email no pertenece a ningun usuario'}]
            })
        }
        //Generar un token y enviar el email
        usuario.token =generarId()
        await usuario.save()

        //Enviar en email
        emailOlvidepassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        //Renderizar un mensaje
        res.render('auth/mensaje',{
            pagina: 'Reestablece un Password',
            mensaje: 'Hemos Enviado un email con las instruciones'
        })
}

const comprobarToken = async(req, res) =>{
    const {token} = req.params

    const usuario = await Usuario.findOne({where:{token}})
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        });
    }

    //Mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    })
    
}

const nuevoPassword = async (req, res) => {
    try {
        // Validar el password
        await check('password').isLength({ min: 6 }).withMessage('El password debe de ser de al menos 6 caracteres').run(req);

        let resultado = validationResult(req);

        // Verificar que el resultado esté vacío
        if (!resultado.isEmpty()) {
            return res.render('auth/reset-password', {
                pagina: 'Restablece Tu Password',
                csrfToken: req.csrfToken(),
                errores: resultado.array()
            });
        }

        const { token } = req.params;
        const { password } = req.body;

        // Identificar quién hace el cambio
        const usuario = await Usuario.findOne({ where: { token } });

        // Verificar si el usuario existe
        if (!usuario) {
            return res.render('auth/reset-password', {
                pagina: 'Restablece Tu Password',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'Token no válido o usuario inexistente' }]
            });
        }

        // Hashear el password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;

        // Guardar el nuevo password
        await usuario.save();

        // Renderizar mensaje de éxito
        res.render('auth/confirmar-cuenta', {
            pagina: 'Password Restablecido',
            mensaje: 'El password se guardó correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};

export {
    formulariologin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
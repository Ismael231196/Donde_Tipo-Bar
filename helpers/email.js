import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos;

    try {
        await transport.sendMail({
            from: 'Donde Tipo Bar',
            to: email,
            subject: 'Confirma tu Cuenta En El Bar Donde Tipo',
            text: 'Confirma tu Cuenta En El Bar Donde Tipo',
            html: `
                <p>Hola ${nombre}, comprueba tu cuenta en el Bar Donde Tipo</p>
                <p>Tu cuenta ya está lista, solo debes confirmar en el siguiente enlace: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a></p>
                <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>
            `,
        });
        console.log('Correo de registro enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo de registro:', error);
    }
};

const emailOlvidepassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos;

    try {
        await transport.sendMail({
            from: 'Donde Tipo Bar',
            to: email,
            subject: 'Restablece tu password En El Bar Donde Tipo',
            text: 'Restablece tu password En El Bar Donde Tipo',
            html: `
                <p>Hola ${nombre}, has solicitado restablecer tu password en el Bar Donde Tipo</p>
                <p>Sigue el siguiente enlace para generar un password nuevo: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Password</a></p>
                <p>Si tú no solicitaste el cambio de password, puedes ignorar el mensaje</p>
            `,
        });
        console.log('Correo de restablecimiento de password enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento de password:', error);
    }
};

export {
    emailRegistro,
    emailOlvidepassword,
};

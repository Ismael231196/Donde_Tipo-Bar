import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt';
import db from '../config/db.js'


const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false //este campo no puede ir vacio
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false //este campo no puede ir vacio
    },
    Password:{
        type: DataTypes.STRING,
        allowNull: false //este campo no puede ir vacio
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.Password = await bcrypt.hash(usuario.Password, salt)
        }
    },
    scopes:{
        eliminarPassword:{
            attributes:{
                exclude: ['Password', 'token', 'confirmado', 'createAt', 'updateAt']
            }
        }
    }
    
})

Usuario.prototype.verificarPassword = function(password) {
    console.log('Password ingresada:', password);
    console.log('Hash almacenado:', this.Password);

    if (!password || !this.Password) {
        throw new Error('Both password and hash are required');
    }

    try {
        return bcrypt.compareSync(password, this.Password);
    } catch (error) {
        console.error('Error al comparar el password:', error);
        throw new Error('Error al comparar el password');
    }
}


export default Usuario
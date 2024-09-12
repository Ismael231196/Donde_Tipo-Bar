import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Duvan',
        email: 'isdusagu23@gmail.com',
        confirmado: 1,
        Password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios
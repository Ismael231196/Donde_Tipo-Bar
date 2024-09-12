import productos from './productos.js';
import precio from './precio.js';
import categoria from './categoria.js';
import Usuario from './Usuario.js';
import Mensaje from './Mensaje.js';
import Administrador from './Administrador.js';

productos.belongsTo(precio, {foreignKey: 'precioId' });
productos.belongsTo(categoria, {foreignKey: 'categoriaId' });
productos.belongsTo(Usuario, {foreignKey: 'usuarioId' });
productos.hasMany(Mensaje, { foreignKey: 'productos1Id'} )

Mensaje.belongsTo(productos, {foreignKey: 'productos1Id' });
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'})

export {
    productos,
    precio,
    categoria,
    Usuario,
    Mensaje,
    Administrador
};

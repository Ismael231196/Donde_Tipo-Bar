

import { Sequelize } from 'sequelize';
import{precio, categoria, productos} from '../models/index.js'



const inicio = async (req, res) => {
    const [categorias, precios,Comida_Rapida, Bebidas] = await Promise.all([
        categoria.findAll({raw: true}),
        precio.findAll({raw: true}),
        productos.findAll({
            limit:3,
            where:{
                categoriaId: 1
            },
            include:[
                {
                model: precio,
                as: 'precio'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
        }),
        productos.findAll({
            limit:3,
            where:{
                categoriaId: 2
            },
            include:[
                {
                model: precio,
                as: 'precio'
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
        })
    ]);
    
        

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios, 
        Comida_Rapida,
        Bebidas,
        csrfToken: req.csrfToken()
    });
};

const Categoria = async (req, res) => {
    const { id } = req.params;
    
    // Comprobar que la categoría exista
    const Categoria = await categoria.findByPk(id);
    if (!Categoria) {
        return res.redirect('/404');
    }

    // Obtener los productos de la categoría
    const productos1 = await productos.findAll({
        where: {
            categoriaId: id
        },
        include: [
            { model: precio, as: 'precio' }
        ]
    });


    res.render('Categoria',{
        pagina: `${Categoria.nombre}`,
        productos1,
        csrfToken: req.csrfToken()
    })
    
    
};

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'Página no encontrada',
        csrfToken: req.csrfToken()
    });
};

const buscador = async (req, res) => {
    const { termino } = req.body;

    // Validar que termino no esté vacío
    if (!termino.trim()) {
        return res.redirect('back');
    }

    try {
        // Consultar los productos
        const productos1 = await productos.findAll({
            where: {
                titulo: {
                    [Sequelize.Op.like]: '%' + termino + '%'
                }
            },
            include: [
                { model: precio, as: 'precio' }
            ]
        });

        res.render('busqueda', {
            pagina: 'Resultados de la búsqueda',
            productos1,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.redirect('back');
    }
};

export {
    inicio,
    Categoria,
    noEncontrado,
    buscador
}

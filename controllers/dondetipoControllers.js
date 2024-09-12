import { unlink } from 'fs/promises'; 
import { access } from 'fs/promises'; // Para comprobar si la imagen existe antes de eliminarla
import { validationResult } from 'express-validator';
import {precio, categoria, productos, Mensaje, Usuario} from '../models/index.js'
import {esVendedor} from '../helpers/index.js'





const admin = async (req, res) => {
  // Leer querystring
  const { pagina: paginaActual } = req.query;

  const exprecion = /^[1-9]$/;

  if (!exprecion.test(paginaActual)) {
    return res.redirect('/mis-productos?pagina=1');
  }

  try {
    const { id } = req.usuario;

    // Límites y offset para el paginador
    const limit = 5;
    const offset = (paginaActual * limit) - limit;

    const [productos1, total] = await Promise.all([
      productos.findAll({
        limit,
        offset,
        where: {
          usuarioId: id
        },
        include: [
          { model: categoria, as: 'categoria' },
          { model: precio, as: 'precio' },
          { model: Mensaje, as: 'mensajes'}
        ]
      }),
      productos.count({
        where: {
          usuarioId: id
        }
      })
    ]);

    res.render('productos/admin', {
      pagina: 'mis productos',
      productos1,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual), 
      total,
      offset,
      limit
    });
  } catch (error) {
    console.log(error);
  }
};


//Formulario para crear un producto
const crear = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    categoria.findAll(),
    precio.findAll()
  ]);

  res.render('productos/crear', {
    pagina: 'Crear Productos',
    categorias,
    precios,
    csrfToken: req.csrfToken(),
    datos: {}
    
  });
};

const guardar = async (req, res) => {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      categoria.findAll(),
      precio.findAll()
    ]);

    return res.render('productos/crear', {
      pagina: 'Crear Productos',
      categorias,
      precios,
      csrfToken: req.csrfToken(), 
      errores: resultado.array(),
      datos: req.body
    });
  }

  // Crear un Registro
  const { titulo, descripcion, precio: precioId, categoria: categoriaId } = req.body;
  const { id: usuarioId } = req.usuario;

  try {
    const productosGuardada = await productos.create({
      titulo,
      descripcion,
      precioId,
      categoriaId,
      usuarioId,
      imagen: ''
    });

    const { id } = productosGuardada;
    res.redirect(`/productos/agregar-imagen/${id}`); // Corregido: comillas invertidas para interpolación

  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  // Validar que el producto exista
  const productos1 = await productos.findByPk(id);

  if (!productos1) {
    return res.redirect('/mis-productos');
  }

  // Validar que el producto no esté publicado
  if (productos1.publicado) {
    return res.redirect('/mis-productos');
  }

  // Validar que el producto pertenezca al usuario que visita la página
  if (req.usuario.id.toString() !== productos1.usuarioId.toString()) {
    return res.redirect('/mis-productos');
  }

  // Renderizar la página para agregar imagen
  res.render('productos/agregar-imagen', {
    pagina: `Agregar Imagen: ${productos1.titulo}`,
    csrfToken: req.csrfToken(),
    productos1,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  // Validar que el producto exista
  const productos1 = await productos.findByPk(id);

  if (!productos1) {
    return res.redirect('/mis-productos'); // Producto no encontrado
  }

  // Validar que el producto no esté publicado
  if (productos1.publicado) {
    return res.redirect('/mis-productos'); // Producto ya publicado
  }

   // Validar que el producto pertenezca al usuario
  if (req.usuario.id.toString() !== productos1.usuarioId.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }

    productos1.imagen = req.file.filename;
    productos1.publicado = 1;
    // Guardar el producto
    await productos1.save();
    // Redirigir al usuario
    next()
};

const editar = async (req, res) =>{

  const {id} = req.params
  //validar que el producto exista
  const productos1 = await productos.findByPk(id)

  if(!productos1){
    return res.redirect('/mis-productos')
  }

  if (productos1.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }

  //revisar que quien visita el Url, es quien creo el producto
  //consultar modelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    categoria.findAll(),
    precio.findAll()
  ]);

  res.render('productos/editar', {
    pagina: `Editar Producto: ${productos1.titulo}`,
    categorias,
    precios,
    csrfToken: req.csrfToken(), 
    datos: productos1
    
  });
}

const guardarCambios = async (req, res) =>{
  //verificar la validacion
  
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      categoria.findAll(),
      precio.findAll()
    ]);

    return res.render('productos/editar', {
      pagina: `Editar Producto`,
      csrfToken: req.csrfToken(), 
      categorias,
      precios,
      errores: resultado.array(), 
      datos: req.body
      
    });
  }

  const {id} = req.params
  //validar que el producto exista
  const productos1 = await productos.findByPk(id)

  if(!productos1){
    return res.redirect('/mis-productos')
  }

  if (productos1.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }

  //Reescribir el objeto y actualizarlo

  try {
    const { titulo, descripcion, precio: precioId, categoria: categoriaId } = req.body;
    productos1.set({
      titulo,
      descripcion,
      precioId,
      categoriaId
    })
    await productos1.save()
    res.redirect('/mis-productos')
  } catch (error) {
    console.log(error);
    
  }
}

const eliminar = async (req, res) => {
  const { id } = req.params;
  
  // Validar que el producto exista
  const productos1 = await productos.findByPk(id);

  if (!productos1) {
    return res.redirect('/mis-productos');
  }

  if (productos1.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }

  const imagePath = `public/uploads/${productos1.imagen}`;

  // Verificar si la imagen existe antes de intentar eliminarla
  try {
    await access(imagePath); // Verifica si la imagen existe
    console.log(`La imagen ${productos1.imagen} existe, procediendo a eliminarla...`);
    
    await unlink(imagePath); // Eliminar la imagen
    console.log(`Se eliminó la imagen ${productos1.imagen}`);
  } catch (error) {
    console.error(`Error al intentar acceder o eliminar la imagen: ${error.message}`);
  }

  // Eliminar el producto
  await productos1.destroy();
  res.redirect('/mis-productos');
};

//Modifica el estado de el Producto
const cambiarEstado = async(req, res) => {
  const { id } = req.params;
  
  // Validar que el producto exista
  const productos1 = await productos.findByPk(id);

  if (!productos1) {
    return res.redirect('/mis-productos');
  }

  if (productos1.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }

    // Actualizar
    productos1.publicado = !productos1.publicado

    await productos1.save()

    res.json({
        resultado: true
    })
  
}

//Muestra un producto
const mostrarProducto = async (req, res) =>{
  const { id } = req.params
  

  //comprobar que la propiedad exista
  const productos1 = await productos.findByPk(id,{
    include: [
      {model: precio, as: 'precio'},
      { model: categoria, as: 'categoria', scope: 'eliminarPassword' }
    ]
  })

  if(!productos1 || !productos1.publicado) {
    return res.redirect('/404')
}
  
  
  res.render('productos/mostrar',{
    productos1,
    pagina: productos1.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, productos1.usuarioId)
    
  })
}


const enviarMensaje = async(req, res) =>{
  const { id } = req.params;

  // Comprobar que el producto exista
  const productos1 = await productos.findByPk(id, {
    include: [
      { model: precio, as: 'precio' },
      { model: categoria, as: 'categoria' }
    ]
  });

  if (!productos1) {
    return res.redirect('/404');
  }

  // Obtener los errores de validación
  const errores = validationResult(req);
  console.log('Errores:', errores.array()); // Verifica si hay errores

  if (!errores.isEmpty()) {
    return res.render('productos/mostrar', {
      productos1,
      pagina: productos1.titulo,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, productos1.usuarioId),
      errores: errores.array() // Pasar los errores aquí
    });
  }
  const {mensaje} = req.body
  const {id: productos1Id} = req.params
  const {id: usuarioId} = req.usuario
  

  //Almacenar el mensaje
  await Mensaje.create({
    mensaje,
    productos1Id,
    usuarioId
  })

  res.redirect('/')
}

//Leer mensajes recibidos
const verMensajes = async (req, res) => {
  const { id } = req.params;
  
  // Validar que el producto exista
  const productos1 = await productos.findByPk(id, {
    include: [
      { model: Mensaje, as: 'mensajes',
        include:[
          {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
        ]
      },
    ]
  });

  if (!productos1) {
    return res.redirect('/mis-productos');
  }

  if (productos1.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-productos'); // Usuario no autorizado
  }
  res.render('productos/mensajes',{
    pagina: 'Mensajes',
    mensajes: productos1.mensajes
  })
}




const inicio = async (req, res) => {
  res.render('inicio1/index1',{
    
  })
}



export { 
  admin,
  crear, 
  guardar, 
  agregarImagen, 
  almacenarImagen,
  editar,
  cambiarEstado,
  guardarCambios,
  eliminar,
  mostrarProducto,
  enviarMensaje,
  verMensajes,
  inicio 
};

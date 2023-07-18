const express = require('express');
const { connectToCollection, desconnect/* , generateId*/ } = require('./mongodb.js');

const server = express();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Control error formato json
server.use(require('body-parser').json());
server.use(function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) { // atrapo errores en el formato del body recibido
        res.status(400).send('Error en el formato json enviado');
    } else next();
});


// Obtener todos los productos (filtros opcionales): Ruta GET http://127.0.0.1:3000/productos
server.get('/productos', async (req, res) => {
    const { nombre, categoria } = req.query;
    let productos = [];

    try {
        const collection = await connectToCollection('computacion');
        if (nombre) {
            const nombreQuery = nombre;
            let productoNombre = RegExp(nombreQuery, "i");
            productos = await collection.find({ nombre: productoNombre}).toArray();
        } else if (categoria) {
            const categoriaQuery = categoria;
            let productoCategoria = RegExp(categoriaQuery, "i");
            productos = await collection.find({ categoria: productoCategoria }).toArray();
        } else productos = await collection.find().toArray();

        res.status(200).send(JSON.stringify(productos, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Hubo un error en el servidor');
    } finally {
        await desconnect();
    }
});

// Obtener un producto específico por codigo: Ruta GET http://127.0.0.1:3000/productos/1
server.get('/productos/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const collection = await connectToCollection('computacion');
        const producto = await collection.findOne({ codigo: { $eq: Number(codigo) } });

        if (!producto) return res.status(400).send('Error. El codigo no corresponde a un producto existente.');

        res.status(200).send(JSON.stringify(producto, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Hubo un error en el servidor');
    } finally {
        await desconnect();
    }
});


// Crear un nuevo producto: Ruta POST http://127.0.0.1:3000/productos
server.post('/productos', async (req, res) => {
    const { codigo, nombre, precio, categoria } = req.body;
    if (!codigo && !nombre && !precio && !categoria) {
        return res.status(400).send('Error. Faltan datos de relevancia.');
    }

    try {
        const collection = await connectToCollection('computacion');
        // generar codigo
        // const producto = { codigo: await generateId(collection), nombre, precio, categoria };
        const producto = { codigo, nombre, precio, categoria };
        await collection.insertOne(producto);

        res.status(200).send(JSON.stringify(producto, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Hubo un error en el servidor');
    } finally {
        await desconnect();
    }
});

// Actualizar precio de un producto específico por codigo: Ruta PUT http://127.0.0.1:3000/productos/1
server.patch('/productos/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const nuevoPrecio = req.body.precio;
    const producto = { precio: nuevoPrecio };

    if (!nuevoPrecio) {
        return res.status(400).send('Error. Faltan datos de relevancia.');
    }

    try {
        const collection = await connectToCollection('computacion');
        const productoCod = await collection.findOne({ codigo: { $eq: Number(codigo) } });
        if (!productoCod) return res.status(400).send('Error. El codigo no corresponde a un producto existente.');
        await collection.updateOne({ codigo: Number(codigo) }, { $set: producto });

        res.status(200).send(JSON.stringify(producto, null, '\t'));
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Hubo un error en el servidor');
    } finally {
        await desconnect();
    }
});

// Eliminar un producto específico por id: Ruta DELETE http://127.0.0.1:3000/productos/1
server.delete('/productos/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const collection = await connectToCollection('computacion');
        const result = await collection.deleteOne({ codigo: { $eq: Number(codigo) } });

        if (result.deletedCount === 1) {
            res.status(200).send('Eliminado');
        } else {
            return res.status(400).send('Error. El codigo no corresponde a un producto existente.');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Hubo un error en el servidor');
    } finally {
        await desconnect();
    }
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});
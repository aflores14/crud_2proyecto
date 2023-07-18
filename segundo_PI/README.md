# CRUD integrando MongoDB en Node.js
### Indice
1 [Introduccion](#introduccion)

* [Especificaciones](#especificaciones)
* [Requerimientos](#requerimientos)
* [Estructura de directorios](#estructura-de-directorios)


2 [Configuracion de Entorno](#configuracion-de-entorno)

3 [Modulo de Productos](#módulo-de-productos)

* [Metodos HTTP](#métodos-http)
* [Método GET](#método-get)
* [Método GET - Específico](#método-get---específico)
* [Método POST](#método-post)
* [Método PATCH](#método-patch)
* [Método DELETE](#método-delete)

## Introduccion

El presente documento, es el **Proyecto Integral N°2** de ***Argentina Program 4.0***. Esta es una pequeña solución informática que sirve registrar productos de computacion.
La misma, fue diseñada y construida sobre una arquitectura API RESTful.

#### Especificaciones
Aplicacion que integra MongoDB en un proyecto Node.js. Servidor HTTP local.

- Servidor: http://127.0.0.1:3000
- Autor: Alejandro S. Flores

#### Requerimientos
- Node.js v18.16.0
- MongoDB v5.6
- GIT v2.40.1
- IDE - Visual Studio Code v1.78.2

#### Estructura de directorios
``` tree
    ├── node_modules
    ├── src
    │   └── server.js
    │   └── mongodb.js
    ├── .env
    ├── .eslintrc.json
    ├── package.json
    ├── package-lock.json 
    └── README.md
```
### CONFIGURACION DE ENTORNO
  - #### VARIABLES DE ENTORNO
    Es necesario asignar los valores a correspondientes a las variables:
    ``` js
        SERVER_PORT=3000
        SERVER_HOST=127.0.0.1

        DATABASE_URL = mongodb+srv://alesjuy:ZERRpNi7EjMaVoiY@cluster0.kxjeu1k.mongodb.net/?retryWrites=true&w=majority
        DATABASE_NAME=computacion
    ```
### MÓDULO DE PRODUCTOS

Este módulo permite la gestión de productos. El mismo, ofrece funciones para agregar, modificar, borrar o leer el registro de un producto.

#### Métodos HTTP
| Tipo | URI | Descripción |
|------|-----|-------------|
| GET | http://127.0.0.1:3000/productos | Obtiene los registros (permite filtros) |
| GET | http://127.0.0.1:3000/productos/1 | Obtiene un registro en específico |
| POST | http://127.0.0.1:3000/productos | Crea un nuevo registro |
| PATCH | http://127.0.0.1:3000/productos/1 | Modifica un registro en específico |
| DELETE | http://127.0.0.1:3000/productos/1 | Elimina un registro en específico |


#### Método GET:
- Request:
    - nombre=Desktop Gaming  *(tipo: string. Trae uno o más productos por parte de su nombre)*
  - Parámetros opcionales de tipo QUERY:
    - categoria=Desktop  *(tipo: string. Trae los productos de una categoría específica)*  
- Response:
    ``` json
        [
            {
                "_id": "64afe145b7a1997cdec8a0d3",
                "codigo": 1,
                "nombre": "Desktop Gaming",
                "precio": 999.99,
                "categoria": "Desktop"
            }
        ]
    ```
  - Código HTTP: **200** *payload: productos*
  - Código HTTP: **500** *message: Se ha generado un error en el servidor*


#### Método GET - Específico:
- Request:
  - Parámetro obligatorio de tipo URL:
    - 1 *(tipo: integer. Indica el código del producto que se requiere obtener)*
- Response:
    ``` json
        {
                "_id": "64afe145b7a1997cdec8a0d3",
                "codigo": 1,
                "nombre": "Desktop Gaming",
                "precio": 999.99,
                "categoria": "Desktop"
        }
    ```
  - Código HTTP: **200** *payload: producto*
  - Código HTTP: **400** *Error. El codigo no corresponde a un producto existente*
  - Código HTTP: **500** *message: Hubo un error en el servidor*


#### Método POST:
- Request:
  - Parámetros requeridos del BODY:
    - codigo=35                     *(tipo: integer. Establece el codigo del producto)* 
    - nombre=Mouses inalambrico *(tipo: string. Establece el valor del nombre)* 
    - precio=1250.55                     *(tipo: integer. Establece el valor del precio)* 
    - categoria=Accesorio                  *(tipo: string. Establece el valor del categoría)* 
- Response:
  - Código HTTP: **200** *payload: producto*
  - Código HTTP: **400** *message: Error en el formato json enviado*
  - Código HTTP: **500** *message: Hubo un error en el servidor*

Nota: *Codigo es unique index en la DB.*


#### Método PATCH:
- Request:
  - Parámetro obligatorio de tipo URL:
    - 16 *(tipo: integer. Indica el código del producto que se requiere modificar)*
  - Parámetros requeridos del BODY:
    - precio=999.75                  *(tipo: integer. Establece el valor del precio)* 
- Response:
  - Código HTTP: **200** *payload: precio*
  - Código HTTP: **400** *message: El codigo no corresponde a un producto existente*
  - Código HTTP: **400** *message: Error. Faltan datos de relevancia.*
  - Código HTTP: **500** *message: Hubo un error en el servidor*


#### Método DELETE:
- Request:
  - Parámetro obligatorio de tipo URL:
    - 16 *(tipo: integer. Indica el código del producto que se requiere eliminar)*
- Response:
  - Código HTTP: **200** *message: 'Eliminado'*
  - Código HTTP: **500** *message: Hubo un error en el servidor*
  - 
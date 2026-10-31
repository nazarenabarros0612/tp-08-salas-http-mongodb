# Trabajo práctico 08 - Endpoints persistentes de reservas de salas

## Descripción

El proyecto parte de la aplicación de reservas de salas de estudio desarrollada en el TP 07.

En esta unidad se incorpora la persistencia con MongoDB Atlas para que el sitio web y la API HTTP trabajen con los mismos documentos.

La aplicación permite crear, listar y consultar reservas mediante formularios HTML y endpoints JSON.

## Tecnologías

- Node.js
- Express 5
- EJS
- Mongoose
- MongoDB Atlas
- ESLint
- Prettier

## Origen del proyecto

Este trabajo continúa el proyecto del TP 07, conservando su estructura, configuración, conexión a MongoDB, vistas, estilos y middleware.

Se reemplaza el almacenamiento en memoria por operaciones persistentes mediante MongoDB.

## Instalación

Instalar las dependencias:

    npm install

## Configuración del entorno

Crear un archivo `.env` a partir de `.env.example`.

Completar las variables:

- `PORT`: puerto de la aplicación.
- `NODE_ENV`: entorno de ejecución.
- `MONGODB_URI`: cadena de conexión de MongoDB Atlas.

La base de datos utilizada es `reservas_salas_u8` y la colección es `reservas`.

La URI debe incluir el nombre de la base de datos.

El archivo `.env` contiene información privada y no debe subirse al repositorio.

## Ejecución

Iniciar el servidor:

    npm start

El comando carga las variables del archivo `.env`, establece la conexión con MongoDB Atlas y luego inicia el servidor.

Abrir en el navegador:

    http://localhost:3000

La aplicación mantiene la conexión con MongoDB mientras el servidor está activo.

Al recibir una señal SIGINT o SIGTERM, cierra el servidor y desconecta la base de datos.

## Estructura del proyecto

- `src/index.js`: conecta con MongoDB e inicia el servidor.
- `src/app.js`: configura Express, las rutas y el middleware de errores.
- `src/config/entorno.js`: lee y valida las variables de entorno.
- `src/config/base-datos.js`: centraliza la conexión y desconexión de MongoDB.
- `src/modelos/reserva.js`: define el esquema y las validaciones de las reservas.
- `src/servicios/reservas-mongo.js`: realiza las operaciones persistentes de reservas.
- `src/controladores/reservas.js`: gestiona las respuestas HTML y JSON.
- `src/rutas/reservas.js`: define las rutas del sitio web.
- `src/rutas/reservas-api.js`: define los endpoints de la API.
- `src/middleware/reservas.js`: valida los datos de entrada.
- `src/middleware/solicitudes.js`: identifica las solicitudes y mide su duración.
- `src/middleware/errores.js`: gestiona los errores de la aplicación.
- `scripts/`: contiene programas de diagnóstico y prueba de MongoDB.
- `views/`: contiene las vistas EJS.
- `public/`: contiene los archivos estáticos y estilos.

El servicio `src/servicios/reservas.js` del TP 07 se conserva como referencia, pero ya no participa del arranque ni del funcionamiento persistente.

## Modelo de Reserva

El modelo contiene los siguientes campos:

- `estudiante`: texto obligatorio, con trim.
- `email`: texto obligatorio, con trim y presencia de `@`.
- `sala`: Sala Norte, Sala Sur o Sala Multimedia.
- `fecha`: texto obligatorio, con trim.
- `turno`: Mañana, Tarde o Noche.
- `personas`: número entero entre 1 y 6.
- `estado`: pendiente o confirmada. Su valor predeterminado es pendiente.

El identificador `_id` es generado automáticamente por MongoDB y se representa como `id` textual en las respuestas.

El cliente no puede establecer el estado ni el identificador al crear una reserva.

## Endpoints de la API

Base de la API:

    http://localhost:3000/api/reservas

| Método | Dirección | Resultado |
|---|---|---|
| GET | `/api/reservas` | Lista todas las reservas. |
| GET | `/api/reservas/:id` | Consulta una reserva por identificador. |
| POST | `/api/reservas` | Crea una reserva. |
| GET | `/api/reservas?sala=Sala%20Norte` | Filtra por sala exacta. |

### Listar reservas

Solicitud:

    GET /api/reservas

Respuesta esperada: estado 200 y un arreglo JSON.

Si no existen reservas, devuelve un arreglo vacío.

### Consultar una reserva

Solicitud:

    GET /api/reservas/:id

Respuesta esperada: estado 200 y el recurso solicitado.

Un identificador mal formado devuelve 400. Un identificador válido que no corresponde a ningún documento devuelve 404.

### Crear una reserva

Solicitud:

    POST /api/reservas

Seleccionar Body, raw y JSON en Postman.

Ejemplo de cuerpo:

    {
      "estudiante": "Ana Ejemplo",
      "email": "ana@example.com",
      "sala": "Sala Norte",
      "fecha": "2026-11-10",
      "turno": "Mañana",
      "personas": 2
    }

Respuesta esperada: estado 201, recurso guardado y cabecera Location.

El estado se establece automáticamente como pendiente.

### Filtrar por sala

Solicitud:

    GET /api/reservas?sala=Sala%20Norte

El filtro busca coincidencias exactas.

Si no hay coincidencias, devuelve estado 200 y un arreglo vacío.

Si el parámetro sala aparece más de una vez, devuelve 400.

## Respuestas y errores

- `200`: consulta correcta.
- `201`: reserva creada correctamente.
- `400`: datos inválidos, identificador mal formado o JSON incorrecto.
- `404`: reserva inexistente o dirección no encontrada.
- `500`: error interno durante una operación.

Las respuestas de la API se realizan en formato JSON.

Los errores internos no exponen trazas ni información privada.

## Sitio web

Se conserva el sitio HTML desarrollado en el TP 07.

Las rutas permiten:

- Consultar la página de inicio.
- Listar reservas.
- Consultar el detalle de una reserva.
- Mostrar el formulario de nueva reserva.
- Crear una reserva desde el formulario.
- Consultar el estado del servicio.

El formulario válido espera la escritura en MongoDB y redirige al listado con estado 302.

Si los datos son inválidos, responde con estado 400 y conserva los valores ingresados.

La ruta `/estado` obtiene la cantidad de reservas desde MongoDB.

## Pruebas de MongoDB

### Comprobar la conexión

    npm run db:comprobar

### Crear una reserva de prueba

    npm run db:crear

Cada ejecución correcta agrega una nueva reserva a la colección.

### Listar reservas

    npm run db:listar

Muestra los documentos almacenados y su cantidad total.

Estos scripts se conservan como herramientas de diagnóstico. La aplicación web y la API utilizan el servicio persistente.

## Pruebas con Postman

Mantener el servidor activo mientras se realizan las solicitudes.

1. Ejecutar GET `/api/reservas` y registrar la cantidad inicial.
2. Ejecutar POST `/api/reservas` con datos ficticios válidos.
3. Registrar el estado 201, el identificador y la cabecera Location.
4. Consultar la dirección Location mediante GET y verificar el mismo recurso.
5. Probar un identificador mal formado y uno válido inexistente.
6. Probar el filtro por sala y el parámetro sala repetido.
7. Probar datos inválidos y comprobar que no aumente la cantidad de reservas.
8. Reiniciar el servidor y consultar nuevamente el mismo identificador.
9. Comprobar la colección `reservas` en MongoDB Atlas.
10. Ejecutar GET `/estado` y comprobar el estado del servicio y la cantidad de reservas.
11. Verificar que las reservas continúen disponibles al cerrar y volver a abrir el navegador.

Los resultados y las cantidades observadas se registran con las pruebas realizadas.

## Persistencia

Las reservas se almacenan en MongoDB Atlas.

El sitio web y la API utilizan el mismo servicio y recuperan los mismos documentos.

No se cargan reservas iniciales automáticamente ni se insertan datos al iniciar el servidor o consultar el listado.

## Limitaciones

Esta entrega implementa creación, listado, consulta por identificador y filtro exacto por sala.

No implementa actualización, eliminación, paginación, autenticación, autorización ni relaciones entre documentos.

Tampoco valida si una fecha es futura, si existen solapamientos o si hay cupos compartidos.

## Formato y análisis estático

Aplicar el formato:

    npm run format

Comprobar el formato:

    npm run format:check

Ejecutar ESLint:

    npm run lint

Ejecutar ambas comprobaciones:

    npm run check

## Comparación con el TP 07

En el TP 07, el sitio web utilizaba reservas almacenadas en memoria y MongoDB se probaba mediante scripts independientes.

En el TP 08, las operaciones de creación, listado y consulta utilizan MongoDB Atlas desde un servicio asíncrono compartido por el sitio web y la API HTTP.
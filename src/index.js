const { crearApp } = require("./app");
const { leerConfiguracion } = require("./config/entorno");

const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("./config/base-datos");

const { crearServicioReservasMongo } = require("./servicios/reservas-mongo");

async function main() {
  const configuracion = leerConfiguracion();

  await conectarBaseDatos();

  const servicioReservas = crearServicioReservasMongo();

  const app = crearApp({
    servicioReservas,
    formatoMorgan: configuracion.formatoMorgan,
  });

  const servidor = app.listen(configuracion.port, () => {
    console.log(
      `Aplicación disponible en http://localhost:${configuracion.port}`,
    );
  });

  let cerrando = false;

  async function cerrarServidor() {
    if (cerrando) {
      return;
    }

    cerrando = true;

    console.log("Cerrando el servidor...");

    servidor.close(async () => {
      try {
        await desconectarBaseDatos();
        console.log("Conexión con MongoDB cerrada.");
      } catch (error) {
        console.error("No se pudo cerrar la conexión con MongoDB.");
        console.error(error.message);
        process.exitCode = 1;
      }
    });
  }

  process.on("SIGINT", cerrarServidor);
  process.on("SIGTERM", cerrarServidor);
}

main().catch(async (error) => {
  console.error("No se pudo iniciar la aplicación.");
  console.error(error.message);

  try {
    await desconectarBaseDatos();
  } catch (errorDesconexion) {
    console.error("No se pudo cerrar la conexión con MongoDB.");
    console.error(errorDesconexion.message);
  }

  process.exitCode = 1;
});

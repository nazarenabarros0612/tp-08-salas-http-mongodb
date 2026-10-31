const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

async function main() {
  try {
    await conectarBaseDatos();
    console.log("La prueba de conexión finalizó correctamente.");
  } catch (error) {
    console.error("No se pudo conectar con MongoDB Atlas.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

main();

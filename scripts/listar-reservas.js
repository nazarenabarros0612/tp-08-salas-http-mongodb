const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find().lean();

    console.log("Reservas guardadas en MongoDB:");

    console.log(JSON.stringify(reservas, null, 2));

    console.log(`Cantidad total de reservas: ${reservas.length}`);
  } catch (error) {
    console.error("No se pudieron listar las reservas.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

main();

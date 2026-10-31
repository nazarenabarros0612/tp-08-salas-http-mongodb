const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    await conectarBaseDatos();

    const reserva = await Reserva.create({
      estudiante: "Ana Pérez",
      email: "ana@gmail.com",
      sala: "Sala Norte",
      fecha: "2026-11-10",
      turno: "Mañana",
      personas: 2,
    });

    console.log("Reserva guardada correctamente.");
    console.log("Identificador de MongoDB:", reserva._id.toString());
  } catch (error) {
    console.error("No se pudo guardar la reserva.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

main();

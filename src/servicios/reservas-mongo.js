const mongoose = require("mongoose");
const Reserva = require("../modelos/reserva");

function representarReserva(reserva) {
  return {
    id: reserva._id.toString(),
    estudiante: reserva.estudiante,
    email: reserva.email,
    sala: reserva.sala,
    fecha: reserva.fecha,
    turno: reserva.turno,
    personas: reserva.personas,
    estado: reserva.estado,
  };
}

function crearServicioReservasMongo() {
  async function listar(sala) {
    const criterio = {};

    if (sala !== undefined) {
      criterio.sala = sala;
    }

    const reservas = await Reserva.find(criterio).lean();

    return reservas.map(representarReserva);
  }

  async function obtenerPorId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
      return null;
    }

    const reserva = await Reserva.findById(id).lean();

    if (!reserva) {
      return null;
    }

    return representarReserva(reserva);
  }

  async function contar() {
    return Reserva.countDocuments();
  }

  async function crear(datos) {
    const nuevaReserva = await Reserva.create({
      estudiante: datos.estudiante,
      email: datos.email,
      sala: datos.sala,
      fecha: datos.fecha,
      turno: datos.turno,
      personas: datos.personas,
    });

    return representarReserva(nuevaReserva);
  }

  function idValido(id) {
    return mongoose.isObjectIdOrHexString(id);
  }

  return {
    listar,
    obtenerPorId,
    contar,
    crear,
    idValido,
  };
}

module.exports = {
  crearServicioReservasMongo,
};

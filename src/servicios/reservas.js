function crearServicioReservas(reservasIniciales) {
  const reservas = [...reservasIniciales];

  function listar() {
    return reservas;
  }

  function obtenerPorId(id) {
    return reservas.find((reserva) => reserva.id === id) ?? null;
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const ultimoId = reservas.reduce(
      (mayorId, reserva) => Math.max(mayorId, reserva.id),
      0,
    );

    const nuevaReserva = {
      id: ultimoId + 1,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    obtenerPorId,
    contar,
    crear,
  };
}

module.exports = {
  crearServicioReservas,
};

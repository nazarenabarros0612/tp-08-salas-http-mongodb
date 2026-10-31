function crearControladorReservas(servicioReservas) {
  function inicio(req, res) {
    res.render("inicio", {
      titulo: "Salas de estudio",
    });
  }

  async function estado(req, res) {
    const cantidad = await servicioReservas.contar();

    res.json({
      servicio: "activo",
      reservas: cantidad,
      solicitudId: res.locals.solicitudId,
    });
  }

  async function listar(req, res) {
    const reservas = await servicioReservas.listar();

    res.render("reservas/lista", {
      titulo: "Reservas de salas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      valores: {},
    });
  }

  async function mostrarDetalle(req, res) {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    res.render("reservas/detalle", {
      titulo: `Reserva #${reserva.id}`,
      reserva,
    });
  }

  async function crear(req, res) {
    await servicioReservas.crear(req.reservaValidada);

    res.redirect(302, "/reservas");
  }

  async function listarApi(req, res) {
    if (req.query.sala !== undefined && typeof req.query.sala !== "string") {
      return res.status(400).json({
        error: "El parámetro sala debe aparecer una sola vez y ser textual.",
      });
    }

    const reservas = await servicioReservas.listar(req.query.sala);

    res.status(200).json(reservas);
  }

  async function obtenerApi(req, res) {
    const id = req.params.id;

    if (!servicioReservas.idValido(id)) {
      return res.status(400).json({
        error: "El identificador de la reserva no tiene un formato válido.",
      });
    }

    const reserva = await servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "No existe una reserva con ese identificador.",
      });
    }

    res.status(200).json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicioReservas.crear(req.reservaValidada);

    const location = `/api/reservas/${reserva.id}`;

    res.location(location).status(201).json(reserva);
  }

  function noEncontrado(req, res) {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  }

  return {
    inicio,
    estado,
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi,
    obtenerApi,
    crearApi,
    noEncontrado,
  };
}

module.exports = {
  crearControladorReservas,
};

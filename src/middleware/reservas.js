const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const valores = req.body ?? {};
  const esApi = req.baseUrl.startsWith("/api/");

  const camposTexto = ["estudiante", "email", "sala", "fecha", "turno"];

  const tiposTextoValidos = camposTexto.every(
    (campo) =>
      typeof valores[campo] === "string" && valores[campo].trim().length > 0,
  );

  const personasTipoValido =
    typeof valores.personas === "number" ||
    (!esApi &&
      typeof valores.personas === "string" &&
      valores.personas.trim() !== "");

  const estudiante =
    typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";

  const email = typeof valores.email === "string" ? valores.email.trim() : "";

  const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";

  const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";

  const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";

  const personas = personasTipoValido ? Number(valores.personas) : NaN;

  const emailValido = email.includes("@");

  const personasValidas =
    Number.isInteger(personas) && personas >= 1 && personas <= 6;

  if (
    !tiposTextoValidos ||
    !personasTipoValido ||
    !emailValido ||
    !salasPermitidas.includes(sala) ||
    !turnosPermitidos.includes(turno) ||
    !personasValidas
  ) {
    const mensaje = "Completá todos los campos con valores válidos.";

    if (esApi) {
      return res.status(400).json({
        error: mensaje,
      });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: mensaje,
      valores,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
};

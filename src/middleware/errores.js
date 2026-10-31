function manejarErrores(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const esApi = req.originalUrl.startsWith("/api");

  const errorDeEntrada =
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.status === 400 ||
    error.statusCode === 400 ||
    (error instanceof SyntaxError && error.status === 400);

  if (errorDeEntrada) {
    const mensaje = "Los datos enviados no son válidos.";

    if (esApi) {
      return res.status(400).json({
        error: mensaje,
      });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: mensaje,
      valores: req.body ?? {},
    });
  }

  console.error("Error interno durante la solicitud.");
  console.error(error.message);

  if (esApi) {
    return res.status(500).json({
      error: "Ocurrió un error interno al procesar la solicitud.",
    });
  }

  res.status(500).render("no-encontrado", {
    titulo: "Error interno",
    mensaje: "Ocurrió un error al procesar la solicitud. Intentá nuevamente.",
  });
}

module.exports = {
  manejarErrores,
};

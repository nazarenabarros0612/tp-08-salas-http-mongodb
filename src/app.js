const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const { crearRouterReservas } = require("./rutas/reservas");
const { crearRouterReservasApi } = require("./rutas/reservas-api");
const { crearControladorReservas } = require("./controladores/reservas");
const { manejarErrores } = require("./middleware/errores");

function crearApp({ servicioReservas, formatoMorgan }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  app.use(morgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const controladorReservas = crearControladorReservas(servicioReservas);

  app.get("/", controladorReservas.inicio);
  app.get("/estado", controladorReservas.estado);

  const reservasRouter = crearRouterReservas(controladorReservas);
  app.use("/reservas", reservasRouter);

  const reservasApiRouter = crearRouterReservasApi(controladorReservas);
  app.use("/api/reservas", reservasApiRouter);

  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "La dirección de la API solicitada no existe.",
    });
  });

  app.use(controladorReservas.noEncontrado);

  app.use(manejarErrores);

  return app;
}

module.exports = {
  crearApp,
};

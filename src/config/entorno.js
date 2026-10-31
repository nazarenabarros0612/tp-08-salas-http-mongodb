function leerConfiguracion(entorno = process.env) {
  const puertoTexto = entorno.PORT ?? "3000";
  const port = Number(puertoTexto);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un entero entre 1 y 65535");
  }

  const nodeEnv = entorno.NODE_ENV ?? "development";
  const formatoMorgan = nodeEnv === "production" ? "combined" : "dev";

  return {
    port,
    nodeEnv,
    formatoMorgan,
  };
}

function leerUriMongo(entorno = process.env) {
  const uri = entorno.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Falta configurar la variable MONGODB_URI");
  }

  return uri;
}

module.exports = {
  leerConfiguracion,
  leerUriMongo,
};

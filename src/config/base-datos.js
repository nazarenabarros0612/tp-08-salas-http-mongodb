const dns = require("node:dns");
const mongoose = require("mongoose");
const { leerUriMongo } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  const uri = leerUriMongo();

  await mongoose.connect(uri);

  console.log("Conexión con MongoDB Atlas establecida.");
}

async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

module.exports = {
  conectarBaseDatos,
  desconectarBaseDatos,
};

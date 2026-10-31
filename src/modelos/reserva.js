const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      match: /@/,
    },

    sala: {
      type: String,
      required: true,
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    },

    fecha: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (valor) => valor.length > 0,
        message: "La fecha no puede estar vacía.",
      },
    },

    turno: {
      type: String,
      required: true,
      enum: ["Mañana", "Tarde", "Noche"],
    },

    personas: {
      type: Number,
      required: true,
      validate: {
        validator: (valor) =>
          Number.isInteger(valor) && valor >= 1 && valor <= 6,
        message: "Las personas deben ser un entero entre 1 y 6.",
      },
    },

    estado: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
  },
  {
    collection: "reservas",
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;

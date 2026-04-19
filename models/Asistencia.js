import mongoose from "mongoose";

const asistenciaSchema = new mongoose.Schema({
  numeroCuenta: String,
  nombreCompleto: String,
  fecha: {
    type: Date,
    default: Date.now
  },
  horaEntrada: String,
  horaSalida: String,
  token: String
});

export default mongoose.model("Asistencia", asistenciaSchema);
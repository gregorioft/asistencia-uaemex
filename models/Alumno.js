import mongoose from "mongoose";

const alumnoSchema = new mongoose.Schema({
  numeroCuenta: {
    type: String,
    required: true,
    unique: true
  },
  nombreCompleto: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Alumno", alumnoSchema);
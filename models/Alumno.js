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
  token: {
    type: String,
    unique: true
  },
  qr: {
    type: String
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

const Alumno = mongoose.model("Alumno", alumnoSchema);

export default Alumno;
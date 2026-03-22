import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  expiracion: {
    type: Date
  }
});

export default mongoose.model("Token", tokenSchema);
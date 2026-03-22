import express from "express";
import Alumno from "../models/Alumno.js";
import crypto from "crypto";

const router = express.Router();

router.post("/alumnos", async (req, res) => {
  try {

    const { numeroCuenta, nombreCompleto, password } = req.body;

    const token = crypto.randomBytes(16).toString("hex");

    const nuevoAlumno = new Alumno({
      numeroCuenta,
      nombreCompleto,
      password,
      token
    });

    await nuevoAlumno.save();

    res.json({
      mensaje: "Alumno registrado",
      alumno: nuevoAlumno
    });

  } catch (error) {

    res.status(500).json({
      error: "Error al registrar alumno"
    });

  }
});

export default router;
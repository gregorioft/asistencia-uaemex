import express from "express";
import Alumno from "../models/Alumno.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const { numeroCuenta, nombreCompleto, password } = req.body;

    // validar campos vacíos
    if (!numeroCuenta || !nombreCompleto || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    // verificar si ya existe
    const existe = await Alumno.findOne({ numeroCuenta });

    if (existe) {
      return res.status(400).json({
        message: "Ese número de cuenta ya está registrado"
      });
    }

    // crear alumno
    const nuevoAlumno = new Alumno({
      numeroCuenta: numeroCuenta.trim(),
      nombreCompleto: nombreCompleto.trim(),
      password: password.trim()
    });

    await nuevoAlumno.save();

    return res.status(201).json({
      message: "Alumno registrado correctamente"
    });

  } catch (error) {

    console.log("ERROR REGISTRO ALUMNO:");
    console.log(error);

    return res.status(500).json({
      message: "Error al registrar alumno",
      error: error.message
    });

  }
});

export default router;
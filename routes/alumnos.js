import express from "express";
import Alumno from "../models/Alumno.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const { numeroCuenta, nombreCompleto, password } = req.body;

    const existe = await Alumno.findOne({ numeroCuenta });

    if (existe) {
      return res.status(400).json({
        message: "Ese número de cuenta ya está registrado"
      });
    }

    const nuevoAlumno = new Alumno({
      numeroCuenta,
      nombreCompleto,
      password
    });

    await nuevoAlumno.save();

    res.json({
      message: "Alumno registrado correctamente",
      alumno: nuevoAlumno
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error al registrar alumno"
    });

  }
});

export default router;
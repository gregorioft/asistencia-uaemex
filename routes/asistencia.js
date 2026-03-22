import express from "express";
import Asistencia from "../models/Asistencia.js";
import Token from "../models/Token.js";

const router = express.Router();

router.post("/", async (req, res) => {

  const { numeroCuenta, token } = req.body;

  try {

    // 🔐 validar token
    const tokenDB = await Token.findOne({ token });

    if (!tokenDB) {
      return res.status(400).json({ message: "Token inválido" });
    }

    if (new Date() > tokenDB.expiracion) {
      return res.status(400).json({ message: "Token expirado" });
    }

    // 🕐 HORA MÉXICO
    const ahora = new Date();

    const horaActual = ahora.toLocaleTimeString("es-MX", {
      timeZone: "America/Mexico_City",
      hour12: true
    });

    // 📅 FECHA MÉXICO
    const fechaMX = new Date(ahora.toLocaleString("en-US", {
      timeZone: "America/Mexico_City"
    }));

    // 📅 rango del día (México)
    const inicioDia = new Date(fechaMX);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaMX);
    finDia.setHours(23, 59, 59, 999);

    // 🔎 buscar asistencia del día
    let asistencia = await Asistencia.findOne({
      numeroCuenta,
      fecha: { $gte: inicioDia, $lte: finDia }
    });

    // 🟢 ENTRADA
    if (!asistencia) {

      asistencia = new Asistencia({
        numeroCuenta,
        horaEntrada: horaActual,
        token,
        fecha: fechaMX
      });

      await asistencia.save();

      return res.json({ message: "Entrada registrada" });

    }

    // 🔴 SALIDA
    if (asistencia && !asistencia.horaSalida) {

      asistencia.horaSalida = horaActual;
      await asistencia.save();

      return res.json({ message: "Salida registrada" });

    }

    // ❌ YA COMPLETO
    return res.json({ message: "Ya registraste asistencia completa hoy" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });

  }

});

export default router;
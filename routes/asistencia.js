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

    // 📅 fecha de hoy
    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0,0,0,0));
    const finDia = new Date(hoy.setHours(23,59,59,999));

    // 🔎 buscar si ya existe asistencia hoy
    let asistencia = await Asistencia.findOne({
      numeroCuenta,
      fecha: { $gte: inicioDia, $lte: finDia }
    });

    const horaActual = new Date().toLocaleTimeString();

    // 🟢 SI NO EXISTE → ES ENTRADA
    if (!asistencia) {

      asistencia = new Asistencia({
        numeroCuenta,
        horaEntrada: horaActual,
        token,
        fecha: new Date()
      });

      await asistencia.save();

      return res.json({ message: "Entrada registrada" });

    }

    // 🔴 SI YA EXISTE Y NO TIENE SALIDA → ES SALIDA
    if (asistencia && !asistencia.horaSalida) {

      asistencia.horaSalida = horaActual;
      await asistencia.save();
      console.log("Guardando asistencia...");

      return res.json({ message: "Salida registrada" });

    }

    // ❌ SI YA TIENE TODO → BLOQUEAR
    return res.json({ message: "Ya registraste asistencia completa hoy" });

  } catch (error) {

    res.status(500).json({ message: "Error en el servidor" });

  }

});

const { numeroCuenta, token, lat, lng } = req.body;
export default router;
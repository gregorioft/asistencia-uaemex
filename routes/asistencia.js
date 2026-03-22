import express from "express";
import Asistencia from "../models/Asistencia.js";
import Token from "../models/Token.js";

const router = express.Router();

// 📍 coordenadas escuela
const LAT_ESCUELA = 19.2645;
const LNG_ESCUELA = -98.8867;

// 📏 calcular distancia
function calcularDistancia(lat1, lon1, lat2, lon2){

const R = 6371e3;

const φ1 = lat1 * Math.PI/180;
const φ2 = lat2 * Math.PI/180;
const Δφ = (lat2-lat1) * Math.PI/180;
const Δλ = (lon2-lon1) * Math.PI/180;

const a =
Math.sin(Δφ/2) * Math.sin(Δφ/2) +
Math.cos(φ1) * Math.cos(φ2) *
Math.sin(Δλ/2) * Math.sin(Δλ/2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

return R * c;
}

router.post("/", async (req, res) => {

  const { numeroCuenta, token, lat, lng } = req.body;

  try {

    // 🔐 validar token
    const tokenDB = await Token.findOne({ token });

    if (!tokenDB) {
      return res.status(400).json({ message: "Token inválido" });
    }

    if (new Date() > tokenDB.expiracion) {
      return res.status(400).json({ message: "Token expirado" });
    }

    // 📍 VALIDAR UBICACIÓN
    if(!lat || !lng){
      return res.status(400).json({ message: "Activa la ubicación" });
    }

    const distancia = calcularDistancia(lat, lng, LAT_ESCUELA, LNG_ESCUELA);

    if(distancia > 100){
      return res.status(400).json({ message: "Fuera de la escuela" });
    }

    // 🕐 hora México
    const ahora = new Date();

    const horaActual = ahora.toLocaleTimeString("es-MX", {
      timeZone: "America/Mexico_City",
      hour12: true
    });

    // 📅 fecha México
    const fechaMX = new Date(ahora.toLocaleString("en-US", {
      timeZone: "America/Mexico_City"
    }));

    // 📅 rango del día
    const inicioDia = new Date(fechaMX);
    inicioDia.setHours(0,0,0,0);

    const finDia = new Date(fechaMX);
    finDia.setHours(23,59,59,999);

    // 🔎 buscar asistencia
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

    return res.json({ message: "Ya registraste asistencia completa hoy" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });

  }

});

export default router;
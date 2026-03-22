import express from "express";
import Asistencia from "../models/Asistencia.js";
import Alumno from "../models/Alumno.js"; // 🔥 IMPORTANTE
import XLSX from "xlsx";
import bcrypt from "bcryptjs";

const router = express.Router();

const ADMIN_USER = "admin";

// 🔐 LOGIN (temporal)
router.post("/login", async (req, res) => {

const { user, pass } = req.body;

if(user !== ADMIN_USER){
return res.json({ok:false});
}

if(pass !== "1234"){
return res.json({ok:false});
}

res.json({ok:true});

});


// 📊 VER ASISTENCIAS (CON NOMBRE + FILTRO)
router.get("/asistencias", async (req, res) => {

try {

const { fecha } = req.query;

let filtro = {};

if(fecha){

const inicio = new Date(fecha + "T00:00:00");
const fin = new Date(fecha + "T23:59:59");

filtro.fecha = {
$gte: inicio,
$lte: fin
};

}

// 🔥 obtener asistencias
const asistenciasDB = await Asistencia.find(filtro).sort({ fecha: -1 });

// 🔥 unir con alumnos
const asistencias = await Promise.all(
asistenciasDB.map(async (a) => {

const alumno = await Alumno.findOne({ numeroCuenta: a.numeroCuenta });

return {
numeroCuenta: a.numeroCuenta,
nombre: alumno ? alumno.nombreCompleto : "Sin registro",
horaEntrada: a.horaEntrada,
horaSalida: a.horaSalida,
fecha: a.fecha
};

})
);

res.json(asistencias);

} catch (error) {

console.log(error);
res.status(500).json({ message: "Error al obtener asistencias" });

}

});


// 📥 EXPORTAR EXCEL (CON NOMBRE)
router.get("/exportar", async (req, res) => {

try {

const asistenciasDB = await Asistencia.find().sort({ fecha: -1 });

const data = await Promise.all(
asistenciasDB.map(async (a) => {

const alumno = await Alumno.findOne({ numeroCuenta: a.numeroCuenta });

return {
Cuenta: a.numeroCuenta,
Nombre: alumno ? alumno.nombreCompleto : "Sin registro",
Entrada: a.horaEntrada || "",
Salida: a.horaSalida || "",
Fecha: new Date(a.fecha).toLocaleDateString()
};

})
);

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

res.setHeader("Content-Disposition", "attachment; filename=asistencias.xlsx");
res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

res.end(buffer);

} catch (error) {

res.status(500).json({ message: "Error al exportar" });

}

});

export default router;
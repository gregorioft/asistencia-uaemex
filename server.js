import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import tokenRoutes from "./routes/token.js";
import adminRoutes from "./routes/admin.js";
import alumnosRoutes from "./routes/alumnos.js";
import asistenciaRoutes from "./routes/asistencia.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/token", tokenRoutes);
app.use("/api/admin", adminRoutes);

// conectar base de datos
connectDB();


// rutas del sistema
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/asistencia", asistenciaRoutes);
app.use(express.static("public"));


// prueba de servidor
app.get("/", (req, res) => {
  res.json({ message: "Servidor UAEMex funcionando 🚀" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
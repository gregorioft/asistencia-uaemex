import express from "express";
import { generarToken } from "../utils/generarToken.js";

const router = express.Router();

router.get("/", async (req,res)=>{

const token = await generarToken();

res.json({token});

});

export default router;
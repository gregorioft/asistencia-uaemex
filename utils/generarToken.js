import crypto from "crypto";
import Token from "../models/Token.js";

export const generarToken = async () => {

  const nuevoToken =
    "UAEMEX-" +
    Date.now() +
    "-" +
    crypto.randomBytes(3).toString("hex");

  const expiracion = new Date(Date.now() + 5 * 60 * 60 * 1000);

  const token = new Token({
    token: nuevoToken,
    expiracion
  });

  await token.save();

  return nuevoToken;
};
const express = require("express");
const router = express.Router();
const gestorUsuarios = require("../gestores/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.use(express.json());

router.post("/", async (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    res.status(400).json({ error: "se debe indicar usuario y clave" });
    return;
  }

  const usuarioExistente = await gestorUsuarios.buscarUsuario(usuario);

  if (!usuarioExistente) {
    res.status(401).json({ error: "datos incorrectos" });
    return;
  }

  const claveCorrecta = await bcrypt.compare(clave, usuarioExistente.hash);

  if (!claveCorrecta) {
    res.status(401).json({ error: "datos incorrectos" });
    return;
  }

  const usuarioToken = { usuario: usuarioExistente.usuario };
  const token = jwt.sign(usuarioToken, "secreto", {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, usuario: usuarioExistente.usuario });
});

module.exports = router;

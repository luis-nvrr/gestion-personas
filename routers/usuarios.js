const express = require("express");
const router = express.Router();
const gestorUsuarios = require("../gestores/usuarios");
const bcrypt = require("bcrypt");

router.use(express.json());

router.post("/", async (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    res.status(400).json({ error: "se debe indicar usuario y clave" });
  }

  const usuarioExistente = await gestorUsuarios.buscarUsuario(usuario);
  if (usuarioExistente) {
    res.status(400).json({ error: "el usuario ya existe" });
    return;
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(clave, saltRounds);
  await gestorUsuarios.agregar(usuario, hash);
  res.status(201).json({ usuario, clave });
});

module.exports = router;

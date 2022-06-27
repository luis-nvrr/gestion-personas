const express = require("express");
const gestorTelefonos = require("../gestores/telefonos");
const gestorUsuarios = require("../gestores/usuarios");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const { sufijo } = req.query;

  if (sufijo) {
    const sufijoInt = parseInt(req.query.sufijo);
    if (isNaN(sufijoInt)) {
      res.status(400).json({ error: "el parámetro debe ser numérico" });
    }

    res.status(200).json(await gestorTelefonos.consultarTerminaEn(sufijoInt));
    return;
  }

  res.status(200).json(await gestorTelefonos.consultarTodos());
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "el formato del numero es invalido" });
    return;
  }

  const telefono = await gestorTelefonos.consultarPorId(id);
  if (!telefono) {
    res.status(404).json({ error: "el telefono no existe" });
    return;
  }
  res.status(200).json(telefono);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "el parámetro debe ser numérico" });
    return;
  }

  const telefonoEncontrado = await gestorTelefonos.consultarPorId(id);
  if (!telefonoEncontrado) {
    res.status(400).json({ error: "el telefono no existe" });
    return;
  }

  const telefono = req.body;
  const telefonoConMismoNumero = await gestorTelefonos.consultarPorNumero(
    telefono.numero
  );
  if (telefonoConMismoNumero) {
    res.status(400).json({ error: "ya existe un telefono con ese número" });
    return;
  }

  await gestorTelefonos.modificar(telefono, id);
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  // ejemplo de jwt
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "debe iniciar sesión" });
    return;
  }

  const token = authorization.substring(7);
  let decodificado;
  try {
    decodificado = jwt.verify(token, "secreto");
  } catch (e) {
    res.status(401).send({ error: "token invalido" });
    return;
  }

  if (!decodificado) {
    res.status(401).send({ error: "token invalido" });
    return;
  }

  const usuario = await gestorUsuarios.buscarUsuario(decodificado.usuario);
  if (!usuario) {
    res.status(401).json({ error: "no puede realizar esa operacion" });
    return;
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "el parámetro debe ser numérico" });
    return;
  }

  const telefonoEncontrado = await gestorTelefonos.consultarPorId(id);
  if (!telefonoEncontrado) {
    res.status(404).json({ error: "el telefono no existe" });
    return;
  }

  await gestorTelefonos.borrar(id);
  res.sendStatus(200);
});

router.post("/", async (req, res) => {
  const telefono = req.body;
  const encontrado = await gestorTelefonos.consultarPorNumero(telefono.numero);
  console.log(encontrado);

  if (encontrado) {
    res.status(400).json({ error: "el número de teléfono ya existe" });
    return;
  }
  await gestorTelefonos.agregar(telefono);
  const creado = await gestorTelefonos.consultarPorNumero(telefono.numero);
  res.status(201).json(creado);
});

module.exports = router;

const express = require("express");
const gestorPersonas = require("../gestores/personas");
const gestorTelefonos = require("../gestores/telefonos");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const filtro = req.query.filtro;
  if (filtro) {
    res
      .status(200)
      .json(await gestorPersonas.consultarNombreOApellidoContiene(filtro));
    return;
  }

  res.status(200).json(await gestorPersonas.consultarTodas());
});

router.get("/:numero", async (req, res) => {
  const numero = parseInt(req.params.numero);
  if (isNaN(numero)) {
    res.status(400).json({ error: "el formato del numero es invalido" });
    return;
  }

  const persona = await gestorPersonas.consultarPorNumero(numero);
  if (!persona) {
    res.status(404).json({ error: "la persona no existe" });
    return;
  }
  res.status(200).json(persona);
});

router.put("/:numero", async (req, res) => {
  const num = parseInt(req.params.numero);
  if (isNaN(num)) {
    res.status(400).json({ error: "el parámetro debe ser numérico" });
    return;
  }

  const persona = req.body;
  const personaEncontrada = await gestorPersonas.consultarPorNumero(num);
  if (personaEncontrada) {
    await gestorPersonas.modificar(persona);
    res.sendStatus(200);
    return;
  }

  await gestorPersonas.agregar(persona);
  res.sendStatus(201);
});

router.delete("/:numero", async (req, res) => {
  const num = parseInt(req.params.numero);
  if (isNaN(num)) {
    res.status(400).json({ error: "el parámetro debe ser numérico" });
    return;
  }

  const personaEncontrada = await gestorPersonas.consultarPorNumero(num);
  if (!personaEncontrada) {
    res.status(404).json({ error: "la persona no existe" });
    return;
  }

  await gestorPersonas.borrar(num);
  res.sendStatus(200);
});

router.get("/:id/telefonos/:tipo", async (req, res) => {
  const idPersona = parseInt(req.params.id);
  const tipoTelefono = parseInt(req.params.tipo);

  if (isNaN(idPersona) || isNaN(tipoTelefono)) {
    res.status(400).json({ error: "los parámetros deben ser numéricos" });
    return;
  }

  const personaEncontrada = await gestorPersonas.consultarPorNumero(idPersona);
  if (!personaEncontrada) {
    res.status(404).json({ error: "la persona no existe" });
    return;
  }

  const telefonos = await gestorTelefonos.consultarPorPersonaYTipo(
    idPersona,
    tipoTelefono
  );
  res.status(200).json(telefonos);
});

router.get("/:id/telefonos", async (req, res) => {
  const idPersona = parseInt(req.params.id);
  if (isNaN(idPersona)) {
    res.status(400).json({ error: "el parámetro debe ser numérico" });
    return;
  }

  const personaEncontrada = await gestorPersonas.consultarPorNumero(idPersona);
  if (!personaEncontrada) {
    res.status(404).json({ error: "la persona no existe" });
    return;
  }

  const telefonos = await gestorTelefonos.consultarPorPersona(idPersona);
  res.status(200).json(telefonos);
});

module.exports = router;

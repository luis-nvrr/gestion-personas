const mariadb = require("mariadb");
const config = require("../config/db");

const agregar = async (persona) => {
  const conn = await mariadb.createConnection(config);
  const valores = [
    persona.documento,
    persona.nombre,
    persona.apellido,
    persona.edad,
  ];
  await conn.query(
    "insert into personas2(documento, nombre, apellido, edad) values (?,?,?,?)",
    valores
  );
  conn.end();
};

const consultarTodas = async () => {
  const conn = await mariadb.createConnection(config);
  const personas = await conn.query("select * from personas2 p");
  conn.end();
  return personas;
};

const consultarPorNumero = async (numero) => {
  const conn = await mariadb.createConnection(config);
  const personas = await conn.query(
    "select * from personas2 where documento = ?",
    [numero]
  );
  conn.end();
  return personas[0];
};

const consultarNombreOApellidoContiene = async (filtro) => {
  const conn = await mariadb.createConnection(config);
  const personas = await conn.query(
    "select * from personas2 p where p.nombre like concat('%', ? , '%') or p.apellido like concat('%', ? , '%')",
    [filtro, filtro]
  );
  conn.end();
  return personas;
};

const modificar = async (persona) => {
  const conn = await mariadb.createConnection(config);
  const valores = [
    persona.nombre,
    persona.apellido,
    persona.edad,
    persona.documento,
  ];
  await conn.query(
    "update personas2 set nombre = ?, apellido = ?, edad = ? where documento = ?",
    valores
  );
  conn.end();
};

const borrar = async (numero) => {
  const conn = await mariadb.createConnection(config);
  await conn.query("delete from personas2 where documento = ? ", [numero]);
  conn.end();
};

module.exports = {
  agregar,
  consultarTodas,
  consultarPorNumero,
  consultarNombreOApellidoContiene,
  modificar,
  borrar,
};

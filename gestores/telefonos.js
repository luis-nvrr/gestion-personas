const mariadb = require("mariadb");
const config = require("../config/db");

const agregar = async (telefono) => {
  const conn = await mariadb.createConnection(config);
  const valores = [telefono.numero, telefono.tipo, telefono.documento];
  await conn.query(
    "insert into telefonos(numero, id_tipo, documento) values (?,?,?)",
    valores
  );
  conn.end();
};

const consultarTodos = async () => {
  const conn = await mariadb.createConnection(config);
  const telefonos = await conn.query("select * from telefonos");
  conn.end();
  return telefonos;
};

const consultarPorId = async (id) => {
  const conn = await mariadb.createConnection(config);
  const telefonos = await conn.query(
    "select * from telefonos where id_telefono = ?",
    [id]
  );
  conn.end();
  return telefonos[0];
};

const consultarPorNumero = async (numero) => {
  const conn = await mariadb.createConnection(config);
  const telefonos = await conn.query(
    "select * from telefonos where numero = ?",
    [numero]
  );
  conn.end();
  return telefonos[0];
};

const consultarPorPersona = async (documento) => {
  const conn = await mariadb.createConnection(config);
  const telefonos = await conn.query(
    "select * from telefonos where documento = ?",
    [documento]
  );
  conn.end();
  return telefonos;
};

const consultarPorPersonaYTipo = async (documento, tipo) => {
  const conn = await mariadb.createConnection(config);
  const telefonos = await conn.query(
    "select * from telefonos where documento = ? and id_tipo = ?",
    [documento, tipo]
  );
  conn.end();
  return telefonos;
};

const consultarTerminaEn = async (sufijo) => {
  const conn = await mariadb.createConnection(config);

  const telefonos = await conn.query(
    "select * from telefonos where cast(numero as char) like concat('%', ?)",
    [sufijo]
  );
  conn.end();
  return telefonos;
};

const modificar = async (telefono, id) => {
  const conn = await mariadb.createConnection(config);
  const valores = [telefono.numero, telefono.tipo, telefono.documento, id];
  await conn.query(
    "update telefonos set numero = ?, id_tipo = ?, documento = ? where id_telefono = ?",
    valores
  );
  conn.end();
};

const borrar = async (id) => {
  const conn = await mariadb.createConnection(config);
  await conn.query("delete from telefonos where id_telefono = ? ", [id]);
  conn.end();
};

module.exports = {
  agregar,
  consultarTodos,
  consultarPorId,
  consultarPorNumero,
  consultarPorPersona,
  consultarPorPersonaYTipo,
  consultarTerminaEn,
  modificar,
  borrar,
};

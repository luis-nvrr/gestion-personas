const mariadb = require("mariadb");
const config = require("../config/db");

const buscarUsuario = async (nombreUsuario) => {
  const conn = await mariadb.createConnection(config);
  const usuarios = await conn.query(
    "select * from usuarios where usuario like ?",
    [nombreUsuario]
  );
  conn.end();
  return usuarios[0];
};

const agregar = async (usuario, clave) => {
  const conn = await mariadb.createConnection(config);
  await conn.query("insert into usuarios values (?, ?)", [usuario, clave]);
  conn.end();
};

module.exports = {
  buscarUsuario,
  agregar,
};

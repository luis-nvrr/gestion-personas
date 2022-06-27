const express = require("express");
const app = express();
const personasRouter = require("./routers/personas");
const telefonosRouter = require("./routers/telefonos");
const usuariosRouter = require("./routers/usuarios");
const loginRouter = require("./routers/login");

app.use("/personas", personasRouter);
app.use("/telefonos", telefonosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/login", loginRouter);

const port = 3000;
app.listen(port, () => {
  console.log("Server started at port", port);
});

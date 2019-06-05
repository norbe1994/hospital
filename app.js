// importaciones de terceros
const express = require('express');
const connect = require('mongoose').connect;
const bodyParser = require('body-parser');

// inicializar variables
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
// interpretar application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

// conectar con MongoDB
connect(
  'mongodb://localhost:27017/hospital',
  { useNewUrlParser: true },
  (err, res) => {
    if (err) throw err;

    console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online');
  }
);

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(PORT, () => {
  console.log(
    `Express server corriendo en puerto ${PORT}: \x1b[32m%s\x1b[0m`,
    'online'
  );
});

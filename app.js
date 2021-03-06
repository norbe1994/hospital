// importaciones de terceros
const express = require('express');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// inicializar variables
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
// helmet: porque es importante ponerse el casco ⛑
app.use(helmet());
//CORS
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// interpretar application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const medicoRoutes = require('./routes/medico');
const hospitalRoutes = require('./routes/hospital');
const loginRoutes = require('./routes/login');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenRoutes = require('./routes/imagen');

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
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(PORT, () => {
  console.log(
    `Express server corriendo en puerto ${PORT}: \x1b[32m%s\x1b[0m`,
    'online'
  );
});

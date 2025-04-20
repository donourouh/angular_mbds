let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let assignment = require('./routes/assignments');
let matieres = require('./routes/matieres');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connexion à MongoDB Atlas
const uri = "mongodb+srv://bambahamed2001:iwWvGOWdqeDXabCj@cluster0.o4qau0o.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("✅ Connecté à la base MongoDB assignments dans le cloud !");
    console.log("🌍 Vérifiez sur : http://localhost:8010/api/assignments");
  }, err => {
    console.log('❌ Erreur de connexion : ', err);
  });

// Middleware CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/assignments', assignment);
app.use('/api/matieres', matieres);

// Démarrage du serveur
let port = process.env.PORT || 8010;
app.listen(port, "0.0.0.0");
console.log('🚀 Serveur démarré sur : http://localhost:' + port);

// Routes pour l'authentification
const authRoute = require('./routes/auth');
app.use('/api', authRoute);

module.exports = app;
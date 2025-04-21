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
  }, err => {
    console.log('❌ Erreur de connexion : ', err);
  });

// Middleware CORS - Accepte les requêtes de n'importe quelle origine
app.use(function (req, res, next) {
  // Accepte les requêtes de toutes les origines en production
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Gestion des requêtes OPTIONS pour le preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes API
app.use('/api/assignments', assignment);
app.use('/api/matieres', matieres);

// Routes pour l'authentification
const authRoute = require('./routes/auth');
app.use('/api', authRoute);

// Route racine pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: "API Assignment fonctionnelle !", 
    endpoints: {
      assignments: "/api/assignments",
      matieres: "/api/matieres",
      auth: "/api/login"
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const port = process.env.PORT || 8010;
const server = app.listen(port, '0.0.0.0', () => {
  console.log('🚀 Serveur démarré sur le port:', port);
}).on('error', (err) => {
  console.error('❌ Erreur de démarrage du serveur:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;
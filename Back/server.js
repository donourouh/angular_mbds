let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let path = require('path');

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

// Servir les fichiers statiques du build Angular
console.log('📂 Dossier courant:', __dirname);
const distPath = path.join(__dirname, 'dist');
console.log('📂 Chemin du dossier dist:', distPath);
app.use(express.static(distPath));

// Routes API
app.use('/api/assignments', assignment);
app.use('/api/matieres', matieres);

// Routes pour l'authentification
const authRoute = require('./routes/auth');
app.use('/api', authRoute);

// Route pour toutes les autres requêtes -> renvoie vers l'application Angular
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(distPath, 'index.html');
    console.log('🔍 Tentative d\'accès à:', indexPath);
    
    if (!require('fs').existsSync(indexPath)) {
      console.log('❌ Fichier non trouvé:', indexPath);
      return res.status(404).send('index.html non trouvé. Chemin: ' + indexPath);
    }
    
    console.log('✅ Fichier trouvé, envoi de index.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de index.html:', error);
    res.status(500).send('Erreur serveur lors de l\'envoi de index.html');
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).send('Erreur serveur interne');
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
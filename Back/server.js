let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let assignment = require('./routes/assignments');
let matieres = require('./routes/matieres');
let User = require('./model/user');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connexion à MongoDB Atlas
const uri = process.env.MONGODB_URI || "mongodb+srv://bambahamed2001:iwWvGOWdqeDXabCj@cluster0.o4qau0o.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

// Fonction pour initialiser les utilisateurs
async function initUsers() {
  try {
    // Vérifier si un utilisateur admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      // Créer l'utilisateur admin
      const admin = new User({
        login: 'admin',
        password: 'admin',
        role: 'admin'
      });
      await admin.save();
      console.log("✅ Utilisateur admin créé");
    }

    // Créer un utilisateur normal s'il n'existe pas
    const userExists = await User.findOne({ role: 'user' });
    if (!userExists) {
      const user = new User({
        login: 'user',
        password: 'user',
        role: 'user'
      });
      await user.save();
      console.log("✅ Utilisateur normal créé");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des utilisateurs:", error);
  }
}

mongoose.connect(uri, options)
  .then(async () => {
    console.log("✅ Connecté à la base MongoDB assignments dans le cloud !");
    // Initialiser les utilisateurs après la connexion
    await initUsers();
    console.log("✅ Initialisation des utilisateurs terminée");
  }, err => {
    console.log('❌ Erreur de connexion : ', err);
  });

// Middleware CORS - Accepte les requêtes de n'importe quelle origine
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Log de toutes les requêtes pour le débogage
  console.log(`📨 ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes pour l'authentification - DOIT ÊTRE AVANT LES AUTRES ROUTES
const authRoute = require('./routes/auth');
app.use('/api', authRoute);

// Routes API
app.use('/api/assignments', assignment);
app.use('/api/matieres', matieres);

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

// Gestion des erreurs 404
app.use((req, res, next) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route non trouvée: ${req.method} ${req.url}` });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
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
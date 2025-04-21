const mongoose = require('mongoose');
const User = require('../model/user');

// URL de connexion MongoDB
const uri = process.env.MONGODB_URI || "mongodb+srv://bambahamed2001:iwWvGOWdqeDXabCj@cluster0.o4qau0o.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0";

async function initDB() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connecté à MongoDB");

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

    console.log("✅ Base de données initialisée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  } finally {
    mongoose.disconnect();
  }
}

initDB(); 
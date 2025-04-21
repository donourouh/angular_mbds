const express = require('express');
const router = express.Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Route de test pour vérifier que l'authentification est accessible
router.get('/login', (req, res) => {
  res.json({
    message: "Route d'authentification fonctionnelle",
    usage: "Utilisez POST /api/login avec { login: 'admin', password: 'admin' }"
  });
});

router.post('/login', async (req, res) => {
  console.log('⭐ Tentative de connexion reçue:', req.body);
  const { login, password } = req.body;

  if (!login || !password) {
    console.log('❌ Login ou mot de passe manquant');
    return res.status(400).json({ message: 'Login et mot de passe requis' });
  }

  try {
    console.log('🔍 Recherche utilisateur avec login:', login);
    const user = await User.findOne({ login, password });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    console.log('✅ Utilisateur trouvé:', { login: user.login, role: user.role });

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    console.log('🎟️ Token généré avec succès');

    res.status(200).json({ 
      token,
      role: user.role,
      message: 'Connexion réussie'
    });
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
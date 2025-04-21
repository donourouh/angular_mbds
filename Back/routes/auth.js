const express = require('express');
const router = express.Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login, password });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'votre_secret_jwt', // À remplacer par une variable d'environnement
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      token,
      role: user.role,
      message: 'Connexion réussie'
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
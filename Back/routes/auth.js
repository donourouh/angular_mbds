const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login, password });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

module.exports = router;
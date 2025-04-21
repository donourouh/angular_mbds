const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant. Veuillez vous connecter.' });
    }

    const decoded = jwt.verify(token, 'votre_secret_jwt');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};

module.exports = authMiddleware;
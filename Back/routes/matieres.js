const express = require('express');
const router = express.Router();
const Matiere = require('../model/matiere');
const authMiddleware = require('../middleware/authMiddleware');

// GET toutes les matières
router.get('/', async (req, res) => {
    try {
        const matieres = await Matiere.find();
        res.json(matieres);
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET une matière par ID
router.get('/:id', async (req, res) => {
    try {
        const matiere = await Matiere.findById(req.params.id);
        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée' });
        }
        res.json(matiere);
    } catch (err) {
        res.status(500).send(err);
    }
});

// POST nouvelle matière
router.post('/', authMiddleware, async (req, res) => {
    const matiere = new Matiere({
        nom: req.body.nom,
        imageMatiere: req.body.imageMatiere,
        prof: {
            nom: req.body.prof.nom,
            photo: req.body.prof.photo
        }
    });

    try {
        const nouvelleMatiereMatiere = await matiere.save();
        res.status(201).json(nouvelleMatiereMatiere);
    } catch (err) {
        res.status(400).send(err);
    }
});

// PUT mettre à jour une matière
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const matiere = await Matiere.findByIdAndUpdate(
            req.params.id,
            {
                nom: req.body.nom,
                imageMatiere: req.body.imageMatiere,
                prof: {
                    nom: req.body.prof.nom,
                    photo: req.body.prof.photo
                }
            },
            { new: true }
        );
        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée' });
        }
        res.json(matiere);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE supprimer une matière
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const matiere = await Matiere.findByIdAndDelete(req.params.id);
        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée' });
        }
        res.json({ message: 'Matière supprimée avec succès' });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router; 
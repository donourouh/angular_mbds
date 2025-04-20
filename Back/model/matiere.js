const mongoose = require('mongoose');

const matiereSchema = mongoose.Schema({
    nom: String,
    imageMatiere: String,
    prof: {
        nom: String,
        photo: String
    }
});

module.exports = mongoose.model('Matiere', matiereSchema); 
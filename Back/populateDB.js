const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Assignment = require('./model/assignment');
const Matiere = require('./model/matiere');

//Connexion à ta propre base MongoDB
mongoose.connect('mongodb+srv://bambahamed2001:iwWvGOWdqeDXabCj@cluster0.o4qau0o.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const matieres = [
  { 
    nom: 'Technologies Web',
    imageMatiere: 'assets/img/web.png',
    prof: {
      nom: 'Mr Buffa',
      photo: 'assets/img/profs/buffa.jpg'
    }
  },
  { 
    nom: 'Base de Données',
    imageMatiere: 'assets/img/bdd.png',
    prof: {
      nom: 'Mme Diaby',
      photo: 'assets/img/profs/diaby.jpg'
    }
  },
  { 
    nom: 'Big Data',
    imageMatiere: 'assets/img/bigdata.png',
    prof: {
      nom: 'Mr Yao',
      photo: 'assets/img/profs/yao.jpg'
    }
  },
  { 
    nom: 'DevOps',
    imageMatiere: 'assets/img/devops.png',
    prof: {
      nom: 'Mme Akissi',
      photo: 'assets/img/profs/akissi.jpg'
    }
  }
];

//Génération d'un devoir fictif
const createFakeAssignment = async () => {
  const matiere = faker.helpers.arrayElement(matieres);
  const firstName = faker.person.firstName('male');
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  return new Assignment({
    nom: fullName,
    dateDeRendu: faker.date.future(),
    rendu: faker.datatype.boolean(),
    auteur: fullName,
    matiere: matiere.nom,
    prof: matiere.prof.nom,
    imageMatiere: matiere.imageMatiere,
    note: faker.number.int({ min: 0, max: 20 }),
    remarques: faker.lorem.sentence()
  });
};

// Remplir la base
const insertData = async () => {
  try {
    // Supprimer les données existantes
    await Promise.all([
      Assignment.deleteMany({}),
      Matiere.deleteMany({})
    ]);

    // Insérer les matières
    await Matiere.insertMany(matieres);
    console.log('✅ Matières insérées avec succès !');

    // Insérer les assignments
    const assignments = [];
    for (let i = 0; i < 1000; i++) {
      assignments.push(await createFakeAssignment());
    }
    await Assignment.insertMany(assignments);
    console.log('✅ 1000 devoirs insérés avec succès !');

  } catch (err) {
    console.error('❌ Erreur :', err);
  } finally {
    mongoose.disconnect();
  }
};

insertData();

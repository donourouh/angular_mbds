const express = require('express');
const router = express.Router();

let Assignment = require('../model/assignment');
const authMiddleware = require('../middleware/authMiddleware'); // Import du middleware

// Récupérer tous les assignments (GET)
function getAssignments(req, res){
    // On regarde si on a name=xxx après le ?
    // ce qui suit le ? s'appelle la query string
    const name = req.query.name;
    const rendu = req.query.rendu;

    let requete = {};
    if(name !== undefined){
        requete.nom = { $regex: name, $options: 'i' };
    }
    if(rendu !== undefined){
        requete.rendu = rendu;
    }

        // requête de recherche par le nom
        Assignment.find(requete, (err, assignments) => {
            if(err){
                res.send(err)
            }
    
            res.send(assignments);
        });
    
}

function getAssignmentsAvecPagination(req, res){
    // On regarde si on a page=xxx et limit=yyy dans la query string
    // c'est-à-dire après le ? dans l'URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // requête de recherche avec pagination
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery, 
        { 
            page: page, 
            limit: limit,

        }, (err, assignments) => {
            if(err){
                res.send(err)
            }
    
            res.send(assignments);
        });

}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    console.log(assignmentId);

    // si on cherche un objet par une ou plusieurs propriétés autres que _id qui
    // est la clé primaire de l'objet, on peut utiliser la méthode find ou findOne
    // exemple :
    // Assignment.find({name: "Nouveau DEVOIR", rendu:false}, (err, assignment) => {
    //     if(err){res.send(err)}
    //     res.json(assignment);
    // })

    // on va plutôt faire un findById avec l'id mongoDB
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.auteur = req.body.auteur;
    assignment.matiere = req.body.matiere;
    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;
    assignment.prof = req.body.prof;
    assignment.imageMatiere = req.body.imageMatiere;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            console.error('Erreur lors de la sauvegarde:', err);
            res.status(500).json({ message: 'Erreur lors de la sauvegarde', error: err });
        } else {
            res.status(201).json(assignment);
        }
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err });
        } else {
            res.json(assignment);
        }
    });
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la suppression', error: err });
        } else {
            res.json({ message: 'Assignment supprimé avec succès', assignment });
        }
    })
}

router.get('/', getAssignmentsAvecPagination);
router.get('/:id', getAssignment);

// Routes protégées
router.post('/', authMiddleware, postAssignment);
router.put('/', authMiddleware, updateAssignment);
router.delete('/:id', authMiddleware, deleteAssignment);

module.exports = router;

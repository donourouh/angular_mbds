export interface Assignment {
    _id?: string;
    nom: string;
    dateDeRendu: Date;
    rendu: boolean;
    // Nouvelles propriétés
    auteur?: string;
    matiere?: {
        nom: string;
    };
    imageMatiere?: string;
    prof?: string;
    note?: number;
    remarques?: string;
}
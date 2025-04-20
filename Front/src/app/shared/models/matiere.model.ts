export interface Matiere {
  _id?: string;
  nom: string;
  imageMatiere: string;
  prof: {
    nom: string;
    photo: string;
  };
}

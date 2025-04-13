import { dropArea } from "../script.js";
import { trouNoir } from "../script.js";
// fonction pour créer un nouvel enfant avec un id unique
export function newLi() {                         
    let li = document.createElement('li');
    let taskID = Date.now().toString();

    li.classList.add('dragable');
    li.setAttribute('draggable', true);
    li.id = "tache" + taskID;
    
// Début de l'action drag, on recupere l'id de l'elment et on y ajoute une classe pour dynamiser l'action
    li.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", e.target.id); // probleme que j'ai eu, le nouvel enfant n'avait pas les evenements
        li.classList.add('draging');                      // possiblité de refactorisation vu qu'il ya 0 taches au début -> mettre tout dans newLi (edit: refactorisation faite)
        dropArea.forEach(Area => {
            Area.classList.add('draging_border');
        });
        deleteArea.classList.add('rotation');
    };

    li.ondrop = (e) => {
        e.preventDefault();
        
    }

    // Apres que l'action de drop soit fini, on supprime les classe de style
    li.ondragend = () => {
        li.classList.remove('draging');
        dropArea.forEach(Area => {
            Area.classList.remove('draging_border');
            Area.classList.remove('border_enter');
        });
        deleteArea.classList.remove('rotation');
        trouNoir.classList.remove('trou_noir_dragover');
    };

    return li;
}
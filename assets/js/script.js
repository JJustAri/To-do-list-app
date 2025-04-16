import * as canvasdark from './modules/canvasdark.js';
import { clearTasks } from './modules/clearTask.js';
import { newLi } from './modules/newLi.js';
import { loadTasks } from './modules/loadTask.js';
import { saveTasks } from './modules/saveTask.js';
import * as deleteValidation from './modules/validateDelete.js'
import { canvas } from './modules/canvasdark.js';

// CANVAS DARK
canvasdark.generate();
canvasdark.resize();
canvasdark.step();

window.onresize = canvasdark.resize;

// FIN CANVAS

// ondragstart  <- les listeners du drag and drop :)
// ondragenter    // Lorsque l'élément entre dans une dropzone
// ondragleave    // Lorsque que l'élément quitte une drop zone
// ondragover     // Lorsque l'element survole une dropzone valide (l'evenement se déclanche a répétition toute les ~100 milisecondes)
// ondrop         // Lorsque l'élement est déposé dans une drop zone valide

// FEATURE DRAG AND DROP
// On recupére les zones de drop
export let dropArea = document.querySelectorAll('.dropArea');

dropArea.forEach(Area => {
    Area.ondragover = (e) => {
        e.preventDefault(); // on enleve le comportement par défaut qui empeche de drop l'element
    };

    // Lorsque l'élément entre dans une dropzone
    Area.ondragenter = () => {
        Area.classList.add('border_enter');
        Area.style.transition = 'all 0.3s ease';
    };

    // Lorsque que l'élément quitte une drop zone
    Area.ondragleave = () => {
        Area.classList.remove('border_enter');
        
    }

    // Lorsque l'élement est déposé dans une drop zone valide
    Area.ondrop = (e) => {
        e.preventDefault();

        if (Area.children.length >= 9 ) { // On return si il ya trop de taches pour eviter que ca dépasse du container (amélioration possible)
            let alertEnterTask = document.getElementById('alertEnterTask');
            alertEnterTask.removeAttribute('hidden');   // déclanchement d'une alert qui dure 5 seconde
            alertEnterTask.textContent = 'Il ya trop de tâches' 
            setTimeout(() => {
            alertEnterTask.setAttribute('hidden',"");
        }, "5000");
        return;
            
        }

        let content = e.dataTransfer.getData("text/plain"); // Changement, on ne récupere plus le contenu de l'element mais l'id cette fois pour pouvoir le déplacer plus d'une fois
        let draggedElement = document.getElementById(content);

        // on attribut une classe a l'element selon ou il est drop, cela permettra de mieux le ranger dans le localstorage
        if(e.target.id == "todoTaskArea") {  

        draggedElement.classList.add('dragable');
          draggedElement.classList.remove('dragable_doing');
          draggedElement.classList.remove('dragable_done');
        }
        
        if(e.target.id == "doingTaskArea") {
          
          draggedElement.classList.add('dragable_doing');
          draggedElement.classList.remove('dragable');
          draggedElement.classList.remove('dragable_done');
        }

        if(e.target.id == "doneTaskArea") {
          
          draggedElement.classList.add('dragable_done');
          draggedElement.classList.remove('dragable_doing');
          draggedElement.classList.remove('dragable');
        }

        
        if (draggedElement) {
        e.target.appendChild(draggedElement);
    }
    }
})

// zone de suppréssion 

let deleteArea = document.querySelector('#deleteArea');
export let trouNoir = document.querySelector('.trou_noir');

deleteArea.ondragenter = () => {
    trouNoir.classList.add('trou_noir_dragover')
    soleil.classList.add('trou_noir_dragover')
}

deleteArea.ondragover = (e) => {
    e.preventDefault();
}

deleteArea.ondragleave = () => {
    trouNoir.classList.remove('trou_noir_dragover')
    soleil.classList.remove('trou_noir_dragover')
}

deleteArea.ondrop = (e) => {
    e.preventDefault()
    let content = e.dataTransfer.getData("text/plain"); 
    let draggedElement = document.getElementById(content);

    if (draggedElement) {
      // Vérifier où se trouve l'élément (quelle classe il a) pour déterminer sa liste dans le localStorage
      let parentList = "";

      if (draggedElement.classList.contains('dragable')) {
          parentList = "tasksTodo";  
      } else if (draggedElement.classList.contains('dragable_doing')) {
          parentList = "tasksDoing";  
      } else if (draggedElement.classList.contains('dragable_done')) {
          parentList = "tasksDone"; 
      }
      

      if (parentList) {
          let storedTasks = JSON.parse(localStorage.getItem(parentList)) || [];
          let taskText = draggedElement.textContent.trim();

          // filter garde dans un nouveau tableau tout les elements qui respecte la condition (donc tasktext est supprimé)
          let newTasks = storedTasks.filter(task => task !== taskText);

          // Mise à jour de localStorage
          localStorage.setItem(parentList, JSON.stringify(newTasks));
  
      }
    draggedElement.remove();
}
    trouNoir.classList.remove('trou_noir_dragover');
    soleil.classList.remove('trou_noir_dragover');
}


//Feature : Ajout d'une tache

const form = document.querySelector('#addTaskForm');  // récupération du formulaire et de ses éléments
const inputForm = document.querySelector('#taskInputId');
export const todoArea = document.querySelector('#todoTaskArea');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let inputValue = inputForm.value;

    // alert si rien n'est saisie

    if(!inputValue.trim()) {
        let alertEnterTask = document.getElementById('alertEnterTask');
        let text = "Veuillez entrer une tâche :)";
        alertEnterTask.removeAttribute('hidden');
        alertEnterTask.textContent = text;
        setTimeout(() => {
            alertEnterTask.setAttribute('hidden',"");
        }, "5000");
        return;
    }

    //alert si il y'a trop de tâches
    if (todoArea.children.length >= 9 ) { 
        let alertEnterTask = document.getElementById('alertEnterTask');
        let text = "il ya trop de tâches";

        alertEnterTask.removeAttribute('hidden');
        alertEnterTask.textContent = text;
        setTimeout(() => {
        alertEnterTask.setAttribute('hidden',"");
    }, "5000");

    return;
}
    let child = newLi();
    child.textContent = inputValue;
    todoArea.appendChild(child);  // ajout de la tâche
    
    form.reset(); //reinitialisation du formulaire (champ de saisie)
})

// sauvegarde dans le local storage
let saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', function() {

  saveTasks();
});

loadTasks();


const doingArea = document.getElementById('doingTaskArea');
const doneArea = document.getElementById('doneTaskArea');
let deleteButton = document.getElementById('deleteButton');

deleteButton.addEventListener('click', async function() {

  deleteValidation.modal.removeAttribute('hidden');

  let isValid = await deleteValidation.validateDelete();

  if(isValid) {

  clearTasks();

  todoArea.replaceChildren();
  doingArea.replaceChildren();
  doneArea.replaceChildren();
}

});


// affichage des taches Todo // Doing // Done avec checkbox             

// récupération
let checkboxTodo = document.getElementById('checkboxInputTodo');
let checkboxDoing = document.getElementById('checkboxInputDoing');
let checkboxDone = document.getElementById('checkboxInputDone');

let todoContainer = document.getElementById('todo');
let doingContainer = document.getElementById('doing');
let doneContainer = document.getElementById('done');

// on cache / montre au click
checkboxTodo.addEventListener('click', function () {

    todoContainer.toggleAttribute('hidden');
})

checkboxDoing.addEventListener('click', function () {

  doingContainer.toggleAttribute('hidden');
})

checkboxDone.addEventListener('click', function () {

  doneContainer.toggleAttribute('hidden');
})

// LIGHT & DARK MODE 

// Récupération des elements du Dom qui vont devoir changer de styles
let circle = document.querySelector(".circle");
let canClick = true;
let inputToggle = document.querySelector("#inputToggleMode");
const canvasLight = document.getElementById('canvasLight');
const todoListBox = document.querySelectorAll('.box');
const buttons = document.querySelectorAll('.manage_button, .add_task_button');
const inputCheckbox = document.querySelectorAll('.add_task_input, .checkbox_container, .background_toggle');
const soleil = document.querySelector('.soleil');

// Déclanchement des qu'un changement se produit sur l'input
inputToggle.addEventListener("change", function () {
  if (!canClick) return; // mise en place d'un setTimeout pour eviter les spam click et faire buger le code

  canClick = false;
  setTimeout(() => canClick = true, 1200);
  circle.classList.toggle("circle_click");

    canvas.classList.toggle('canvasLightAppear');   //changement de canvas selon le mode dark / light
    canvasLight.classList.toggle('canvasLightAppear')

    todoListBox.forEach(box => { // changement des différentes listes de tâches
        box.classList.toggle('box_light');
    });

    buttons.forEach(button => { // changement des boutons
        button.classList.toggle('manage_button_light');
    });

    inputCheckbox.forEach(element => { // changement de la checkbox et de l'input d'ajout d'elements
        element.classList.toggle('background_checkbox_light');
    })

    trouNoir.classList.toggle('disapear'); // changement d'icone
    soleil.classList.toggle('d-none');

    deleteValidation.modal.classList.toggle('modal_light'); // changement du modal de suppréssion
});





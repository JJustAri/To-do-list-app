const STAR_COLOR = "#fff";
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

const canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d");

let scale = 1, // device pixel ratio
  width,
  height;

let stars = [];

let pointerX, pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;


function generate() {
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
    });
  }
}

function placeStar(star) {
  star.x = Math.random() * width;
  star.y = Math.random() * height;
}

function recycleStar(star) {
  let direction = "z";

  let vx = Math.abs(velocity.x),
    vy = Math.abs(velocity.y);

  if (vx > 1 || vy > 1) {
    let axis;

    if (vx > vy) {
      axis = Math.random() < vx / (vx + vy) ? "h" : "v";
    } else {
      axis = Math.random() < vy / (vx + vy) ? "v" : "h";
    }

    if (axis === "h") {
      direction = velocity.x > 0 ? "l" : "r";
    } else {
      direction = velocity.y > 0 ? "t" : "b";
    }
  }

  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

  if (direction === "z") {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  } else if (direction === "l") {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "r") {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "t") {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  } else if (direction === "b") {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }
}

function resize() {
  scale = window.devicePixelRatio || 1;

  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  stars.forEach(placeStar);
}

function step() {
  context.clearRect(0, 0, width, height);

  update();
  render();

  requestAnimationFrame(step);
}

function update() {
  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += (velocity.tx - velocity.x) * 0.8;
  velocity.y += (velocity.ty - velocity.y) * 0.8;

  stars.forEach((star) => {
    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += (star.x - width / 2) * velocity.z * star.z;
    star.y += (star.y - height / 2) * velocity.z * star.z;
    star.z += velocity.z;

    // recycle when out of bounds
    if (
      star.x < -OVERFLOW_THRESHOLD ||
      star.x > width + OVERFLOW_THRESHOLD ||
      star.y < -OVERFLOW_THRESHOLD ||
      star.y > height + OVERFLOW_THRESHOLD
    ) {
      recycleStar(star);
    }
  });
}

function render() {
  stars.forEach((star) => {
    context.beginPath();
    context.lineCap = "round";
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5 * Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo(star.x, star.y);

    var tailX = velocity.x * 2,
      tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if (Math.abs(tailX) < 0.1) tailX = 0.5;
    if (Math.abs(tailY) < 0.1) tailY = 0.5;

    context.lineTo(star.x + tailX, star.y + tailY);

    context.stroke();
  });
}

function movePointer(x, y) {
  if (typeof pointerX === "number" && typeof pointerY === "number") {
    let ox = x - pointerX,
      oy = y - pointerY;

    velocity.tx = velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
    velocity.ty = velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
  }

  pointerX = x;
  pointerY = y;
}

// FIN CANVAS

// ondragstart  <- les listeners du drag and drop :)
// ondragenter
// ondragleave
// ondragover
// ondrop

// Feature drag and drop 

// On recupére tout les elements draggable ainsi que les zones de drop
let drags = document.querySelectorAll('.dragable');
let dropArea = document.querySelectorAll('.dropArea');

// on enleve le comportement par défaut qui empeche de drop l'element
dropArea.forEach(Area => {
    Area.ondragover = (e) => {
        e.preventDefault();
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
            alertEnterTask.removeAttribute('hidden');
            alertEnterTask.textContent = 'Il ya trop de tâches'
            setTimeout(() => {
            alertEnterTask.setAttribute('hidden',"");
        }, "5000");
        return;
            
        }

        let content = e.dataTransfer.getData("text/plain"); // Changement, on ne récupere plus le contenu de l'element mais l'id cette fois pour pouvoir le déplacer plus d'une fois
        let draggedElement = document.getElementById(content);
        if (draggedElement) {
        e.target.appendChild(draggedElement);
    }
    }
})

// zone de suppréssion 

let deleteArea = document.querySelector('#deleteArea');
let trouNoir = document.querySelector('.trou_noir');

deleteArea.ondragenter = () => {
    trouNoir.classList.add('trou_noir_dragover')
}

deleteArea.ondragover = (e) => {
    e.preventDefault();
}

deleteArea.ondragleave = () => {
    trouNoir.classList.remove('trou_noir_dragover')
}

deleteArea.ondrop = (e) => {
    e.preventDefault()
    let content = e.dataTransfer.getData("text/plain"); 
    let draggedElement = document.getElementById(content);

    if(draggedElement) {
    draggedElement.remove();
}
    trouNoir.classList.remove('trou_noir_dragover')
}

// fonction pour créer un nouvel enfant avec un id unique
function newLi() {                         
    let li = document.createElement('li');
    let taskID = Date.now().toString();

    li.classList.add('dragable');
    li.setAttribute('draggable', true);
    li.id = "tache" + taskID;
    
// Début de l'action drag, on recupere l'id de l'elment et on y ajoute une classe pour dynamiser l'action
    li.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", e.target.id); // probleme que j'ai eu, le nouvel enfant n'avait pas les evenements
        li.classList.add('draging');                       // possiblité de refactorisation vu qu'il ya 0 taches au début -> mettre tout dans newLi (edit: refactorisation faite)
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

//Feature : Ajout d'une tache

const form = document.querySelector('#addTaskForm');  // récupération du formulaire et de ses éléments
const inputForm = document.querySelector('#taskInputId');
const todoArea = document.querySelector('#todoTaskArea');

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
    todoArea.appendChild(child);
    
    form.reset();
})
//fonction de sauvegarde
export function saveTasks() {
  let tasksTodo = document.querySelectorAll(".dragable");
  let tasksDoing = document.querySelectorAll(".dragable_doing");
  let tasksDone = document.querySelectorAll(".dragable_done");

  let taskListTodo = [];  // on crée un tableau pour "etat" pour les replacer au bon endroit lors du load
  let taskListDoing = [];
  let taskListDone = [];

  tasksTodo.forEach(task => {    // on range dans le bon tableau selon sa classe (voir ligne 222 pour la gestion des classes)
      taskListTodo.push(task.textContent);  
  });

  tasksDoing.forEach(task => {
      taskListDoing.push(task.textContent);
  });

  tasksDone.forEach(task => {
      taskListDone.push(task.textContent);
  });
  
  // convertion de l'objet en string car localstorage ne peut stocker que des strings
  localStorage.setItem("tasksTodo", JSON.stringify(taskListTodo)); 
  localStorage.setItem("tasksDoing", JSON.stringify(taskListDoing));
  localStorage.setItem("tasksDone", JSON.stringify(taskListDone));
};
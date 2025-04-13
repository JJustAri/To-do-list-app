// fonction de chargement des taches (déclanché a l'ouverture de l'application)
import { newLi } from "./newLi.js";
import { todoArea } from "../script.js";

export function loadTasks() {
  // récupération de nos taches dans le local storage
  let contentTodo = localStorage.getItem("tasksTodo");
  let contentDoing = localStorage.getItem("tasksDoing");
  let contentDone = localStorage.getItem("tasksDone");

  // on les repasse en string puis on les remets (on recrée puis ajoute un textcontent) dans la bonne zone
  if (contentTodo) {
    let loadTaskListTodo = JSON.parse(contentTodo);
    loadTaskListTodo.forEach((taskText) => {
      let child = newLi();
      child.textContent = taskText;
      todoArea.appendChild(child);
    });
  }

  if (contentDoing) {
    let loadTaskListDoing = JSON.parse(contentDoing);
    loadTaskListDoing.forEach((taskText) => {
      let child = newLi();
      child.textContent = taskText;
      doingArea.appendChild(child);
    });
  }

  if (contentDone) {
    let loadTaskListDone = JSON.parse(contentDone);
    loadTaskListDone.forEach((taskText) => {
      let child = newLi();
      child.textContent = taskText;
      doneArea.appendChild(child);
    });
  }
}

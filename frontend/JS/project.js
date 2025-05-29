const PARAMS = new URLSearchParams(window.location.search);
const PROJECT_ID = PARAMS.get('projectId');
const PROJECT_NAME_IN_DB = PROJECTS_ITEMS + "_" + PROJECT_ID;
var draggedTask = null;

const PROJECT_NAME_ELEMENT = document.getElementById("project-name");
const TASK_TITLE_INPUT_ELEMENT = document.getElementById("task-title-input");
const ADD_NEW_TASK_BUTTON_ELEMENT = document.getElementById("add-new-task-button");
const TODO_LIST_ELEMENT = document.getElementById("todo-list");
const IN_PROGRESS_LIST_ELEMENT = document.getElementById("in-progress-list");
const DONE_LIST_ELEMENT = document.getElementById("done-list");
const TODO_COUNT_ELEMENT = document.getElementById("todo-count");
const IN_PROGRESS_COUNT_ELEMENT = document.getElementById("in-progress-count");
const DONE_COUNT_ELEMENT = document.getElementById("done-count");

document.addEventListener("DOMContentLoaded", function () {
    const project = getProjectFromDB(PROJECT_ID);
    if (project) {
        PROJECT_NAME_ELEMENT.textContent = project.projectName;
    } else {
        alert("Project not found.");
        window.location.href = "home.html";
    }
});

function addTaskToProject() {
    const taskTitle = TASK_TITLE_INPUT_ELEMENT.value;
    if (taskTitle === "") {
        alert("Task title cannot be empty.");
    }
    else{
        const task = {
            title: taskTitle
        };

        addTaskToProjectInDB(PROJECT_ID, task);
        TASK_TITLE_INPUT_ELEMENT.value = "";
        loadTasks();
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.draggable = true;
    taskElement.textContent = task.title;

    taskElement.addEventListener("dragstart", function (event) {
        draggedTask = taskElement;
        task.style.display = "none";
    });

    taskElement.addEventListener("dragend", function () {
        taskElement.style.display = "flex";
        draggedTask = null;
    });

    return taskElement;
}

function loadTasks() {
    const project = getProjectFromDB(PROJECT_ID);
    if (project) {
        TODO_LIST_ELEMENT.innerHTML = "";
        IN_PROGRESS_LIST_ELEMENT.innerHTML = "";
        DONE_LIST_ELEMENT.innerHTML = "";

        project.todoList.forEach(task => {
            const taskElement = createTaskElement(task, "todo");
            TODO_LIST_ELEMENT.appendChild(taskElement);
        });

        project.inProgressList.forEach(task => {
            const taskElement = createTaskElement(task, "in-progress");
            IN_PROGRESS_LIST_ELEMENT.appendChild(taskElement);
        });

        project.doneList.forEach(task => {
            const taskElement = createTaskElement(task, "done");
            DONE_LIST_ELEMENT.appendChild(taskElement);
        });

        updateCounts();
    }
}
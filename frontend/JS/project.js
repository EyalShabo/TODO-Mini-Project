const PARAMS = new URLSearchParams(window.location.search);
const PROJECT_ID = PARAMS.get('projectId');
const PROJECT_NAME_IN_DB = PROJECTS_ITEMS + "_" + PROJECT_ID;
var draggedTask = null;
var project = getProjectFromDB(PROJECT_ID);

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
    project = getProjectFromDB(PROJECT_ID);

    if (project) {
        PROJECT_NAME_ELEMENT.innerHTML = project.projectName;

        document.querySelectorAll('.kanban-board-step').forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault(); 
            });

            column.addEventListener('drop', (e) => {
                if (draggedTask) {
                    const innerList = column.querySelector(".kanban-list");
                    const from = draggedTask.dataset.step;
                    const to = innerList.dataset.stepname;

                    draggedTask.dataset.step = innerList.dataset.stepname;
                    
                    if(innerList){
                        innerList.appendChild(draggedTask);
                        passTaskInDB(project.projectId, Number(draggedTask.dataset.taskId), from, to);
                    }
                }
            });
        });

        loadTasks();

    } else {
        alert("Project not found.");
        window.location.href = "home.html";
    }


});

ADD_NEW_TASK_BUTTON_ELEMENT.addEventListener("click", function(e) {
    e.preventDefault();

    if(!TASK_TITLE_INPUT_ELEMENT.value.trim()){
        alert("Please enter a title for the task. The task title cannot be empty.")
    }

    else {
        addTaskToProjectInDB(project.projectId, {title: TASK_TITLE_INPUT_ELEMENT.value});
        loadTasks();
        TASK_TITLE_INPUT_ELEMENT.value = "";
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

function createTaskElement(task, taskInStep) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.draggable = true;
    taskElement.dataset.step = taskInStep;
    taskElement.dataset.taskId = task.id;
    taskElement.innerHTML = 
        `<h3>${task.title}</h3>
         <img src="Images/Icons/grabage.png" alt="Delete Task" class="delete-task-button">`;

    taskElement.addEventListener("dragstart", function (event) {
        draggedTask = taskElement;
        setTimeout(() => taskElement.style.display = "none", 0);
    });

    taskElement.addEventListener("dragend", function () {
        setTimeout(() => {
            taskElement.style.display = "flex";
            draggedTask = null;
        }, 0);

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
            const taskElement = createTaskElement(task, "todoList");
            TODO_LIST_ELEMENT.appendChild(taskElement);
        });

        project.inProgressList.forEach(task => {
            const taskElement = createTaskElement(task, "inProgressList");
            IN_PROGRESS_LIST_ELEMENT.appendChild(taskElement);
        });

        project.doneList.forEach(task => {
            const taskElement = createTaskElement(task, "doneList");
            DONE_LIST_ELEMENT.appendChild(taskElement);
        });
    }
}
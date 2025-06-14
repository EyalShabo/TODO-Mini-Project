import { UserRepository } from "../DB/userRepository.js";
import { ProjectRepository } from "./../DB/projectRepository.js";
import { TaskRepository } from "./../DB/taskRepository.js";
import * as KanbanDOM from "./../DOM/dom.kanban.js";
import { escapeHTML } from "./../security.js";
import * as UpdateTask from "./update-task.js";
export var draggedTask = null;
var filterDifficultyArray = [];
var assignedToArray = [];

const difficultyOrder = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3
};

export function getProject(){
    const params = new URLSearchParams(window.location.search);
    return ProjectRepository.get(params.get('projectId'));
}

function createElement(taskJson, stage){
    const difficultyColorArray = ["#A0C6EB", "#438FD7", "#215F9A"];
    const taskElement = document.createElement("div");
    taskElement.style.borderLeftColor = difficultyColorArray[difficultyOrder[taskJson.difficulty] - 1]
    taskElement.className = "task";
    taskElement.draggable = true;
    taskElement.dataset.stage = stage;
    taskElement.dataset.id = taskJson.id;
    taskElement.innerHTML = 
        `<div class="task-content">
            <h3>${escapeHTML(taskJson.title)}</h3>
            <p>${escapeHTML(taskJson.description || "")}</p>
            <p><strong>Difficulty:</strong> ${escapeHTML(taskJson.difficulty || "N/A")}</p>
            <p><strong>Assigned to:</strong> ${escapeHTML(taskJson.assignedTo ? taskJson.assignedTo.length > 0 ? taskJson.assignedTo.map(user => UserRepository.getUserObject(user).name).join(", ") : "Everyone" : "Everyone")}</p>
        </div>
        <div class="task-actions">
            <img src="CSS/Images/Icons/edit.png" alt="Edit Task" class="edit-task-button">
            <img src="CSS/Images/Icons/grabage.png" alt="Delete Task" class="delete-task-button">
        </div>`;

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

    taskElement.querySelector(".delete-task-button").addEventListener("click", function (e) {
        TaskRepository.delete(getProject().projectId, taskElement.dataset.stage, Number(taskElement.dataset.id));
        loadTasks();
    });

    taskElement.querySelector(".edit-task-button").addEventListener("click", function (e) {
        UpdateTask.updateTask(getProject().projectId, taskElement.dataset.id, taskElement.dataset.stage);
    });

    return taskElement;
}

function _loadTasks(filterFunction, sortFunction){
    const project = getProject();

    document.querySelectorAll(".task-list").forEach(stage => {
        stage.innerHTML = "";
    });

    document.querySelectorAll(".kanban-board-stage").forEach(stageElement => {
        const stage = stageElement.querySelector(".task-list").dataset.stage;
        const stageItems = project[stage].sort(sortFunction).filter(filterFunction);
        stageElement.querySelector(".count").innerHTML = stageItems.length;

        stageItems.forEach(task => {
            stageElement.querySelector(".task-list").appendChild(createElement(task, stage));
        })
    });

    updateProgressBar(filterFunction);
}

function getSortFunctionByDifficulty() {
    const order = KanbanDOM.SORT_SELECT.value;

    switch (order) {
        case "asc":
            return (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "desc":
            return (a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        default:
            return () => 0; 
    }
}

export function loadTasks(){
    filterDifficultyArray = Array.from(KanbanDOM.FILTER_DIFFICULTY_LEVEL.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    filterDifficultyArray = filterDifficultyArray.length == 0 ? 
        Array.from(KanbanDOM.FILTER_DIFFICULTY_LEVEL.querySelectorAll('input[type="checkbox"]')).map(cb => cb.value) 
            :
        filterDifficultyArray;
    
    assignedToArray =  Array.from(KanbanDOM.FILTER_ASSIGNED.querySelectorAll('input[type="checkbox"]:checked')).map(cb => Number(cb.value));
    assignedToArray  = assignedToArray.length == 0 ? 
        Array.from(KanbanDOM.FILTER_ASSIGNED.querySelectorAll('input[type="checkbox"]')).map(cb => Number(cb.value)) 
            :
        assignedToArray ;

    const filterFunction = (task) => {
        const matchesDifficulty = filterDifficultyArray.includes(task.difficulty);
        const matchesAssignee = task.assignedTo.length === 0 || task.assignedTo.some(id => assignedToArray.includes(id));
        return matchesDifficulty && matchesAssignee;
    }

    _loadTasks(filterFunction , getSortFunctionByDifficulty());
}

function updateProgressBar(filterFunction){
    const project = getProject();

    const totalTasks = Array.from(document.querySelectorAll(".progress-bar")).map(bar => project[bar.dataset.stage].filter(filterFunction).length).reduce((a, b) => a + b, 0);

    document.querySelectorAll(".progress-bar").forEach(bar => {
        const stage = bar.dataset.stage;
        const count = project[stage].filter(filterFunction).length;
        const percent = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
        bar.style.width = percent + "%";
    });
}

function addTask(){
    if(!KanbanDOM.TASK_TITLE_INPUT.value.trim()){
        alert("Please enter a title for the task. The task title cannot be empty.")
    }

    else {
        TaskRepository.create(getProject().projectId, 
            {
                title: KanbanDOM.TASK_TITLE_INPUT.value,
                description: KanbanDOM.TASK_DESCRIPTION_INPUT.value,
                difficulty: KanbanDOM.TASK_LEVEL_SELECT.value,
                assignedTo: Array.from(KanbanDOM.TASK_SELECT_ASSIGNED.querySelectorAll('input[type="checkbox"]:checked')).map(cb => Number(cb.value))
            });
        KanbanDOM.TASK_TITLE_INPUT.value = "";
        KanbanDOM.TASK_DESCRIPTION_INPUT.value = "";
        loadTasks();
    }
}

KanbanDOM.ADD_NEW_TASK_BUTTON.addEventListener("click", function(e) {
    e.preventDefault();
    addTask();
});

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault(); 
    addTask();
});
import { TaskRepository } from "./../DB/taskRepository.js";
import { UserRepository } from "./../DB/userRepository.js";
import * as KanbanDOM from "./../DOM/dom.kanban.js";
import * as Tasks from "./task.js";
import * as Multiselect from "./../multiselect.js";
import * as UpdateTask from "./update-task.js";
import { escapeHTML } from "../security.js";

function makeStagesDragOver(){
    const project = Tasks.getProject();

    document.querySelectorAll('.kanban-board-stage').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); 
        });

        column.addEventListener('drop', (e) => {
            if (Tasks.draggedTask) {
                const innerList = column.querySelector(".task-list");
                const from = Tasks.draggedTask.dataset.stage;
                const to = innerList.dataset.stage;

                Tasks.draggedTask.dataset.stage = to;
                
                if(innerList){
                    TaskRepository.moveBetweenStages(project.projectId, Number(Tasks.draggedTask.dataset.id), from, to);
                    Tasks.loadTasks();
                }
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const project = Tasks.getProject();

    if (project) {
        KanbanDOM.PROJECT_NAME_ELEMENT.innerHTML = escapeHTML(project.projectName);
        makeStagesDragOver();
        
        UserRepository.getList().forEach(user => {
            KanbanDOM.TASK_SELECT_ASSIGNED_ADD_OPTIONS.innerHTML += `
                <div class="multiselect-option">
                    <label>
                        <input type="checkbox" value="${user["id"]}"> ${escapeHTML(user["name"])}
                    </label>
                </div>`;
            
            KanbanDOM.FILTER_ASSIGNED_ADD_OPTIONS.innerHTML += `
                <div class="multiselect-option">
                    <label>
                        <input type="checkbox" value="${user["id"]}"> ${escapeHTML(user["name"])}
                    </label>
                </div>`;

            KanbanDOM.UPDATE_TASK_ASSIGNED_TO_MULTISELECT_OPTIONS.innerHTML += `
                <div class="multiselect-option">
                    <label>
                        <input type="checkbox" value="${user["id"]}"> ${escapeHTML(user["name"])}
                    </label>
                </div>`;
        });

        Tasks.loadTasks();

    } else {
        alert("Project not found.");
        window.location.href = "index.html";
    }
});

KanbanDOM.TASK_FILTERS_ELEMENT.addEventListener("change", function(){
    Tasks.loadTasks();
});
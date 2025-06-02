import { TaskRepository } from "./../DB/taskRepository.js";
import { UserRepository } from "./../DB/userRepository.js";
import * as KanbanDOM from "./../DOM/dom.kanban.js";
import * as Tasks from "./task.js";
import * as Multiselect from "./../multiselect.js";

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
        KanbanDOM.PROJECT_NAME_ELEMENT.innerHTML = project.projectName;
        makeStagesDragOver();
        Tasks.loadTasks();
        
        UserRepository.getList().forEach(user => {
            KanbanDOM.TASK_SELECT_ASSIGNED_ADD_OPTIONS.innerHTML += `
                <div class="multiselect-option">
                    <label>
                        <input type="checkbox" value="${user["id"]}"> ${user["name"]}
                    </label>
                </div>`;
            
            KanbanDOM.FILTER_ASSIGNED_ADD_OPTIONS.innerHTML += `
                <div class="multiselect-option">
                    <label>
                        <input type="checkbox" value="${user["id"]}"> ${user["name"]}
                    </label>
                </div>`;
        });


    } else {
        alert("Project not found.");
        window.location.href = "index.html";
    }
});


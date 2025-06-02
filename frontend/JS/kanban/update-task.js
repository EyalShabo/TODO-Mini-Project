import { TaskRepository } from "./../DB/taskRepository.js";
import * as KanbanDOM from "./../DOM/dom.kanban.js";
import { loadTasks } from "./task.js";

function updateMultiselectText(multiselect) {
    const selectedSpan = multiselect.querySelector(".multiselect-selected");
    const selected = Array.from(multiselect.querySelectorAll('input[type="checkbox"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.closest("label").textContent.trim());

    selectedSpan.textContent = selected.length ? selected.join(", ") : "All";
}

export function updateTask(projectId, taskId, taskStage){
    KanbanDOM.UPDATE_TASK_MODEL.dataset.projectId = projectId;
    KanbanDOM.UPDATE_TASK_MODEL.dataset.taskId = taskId;
    KanbanDOM.UPDATE_TASK_MODEL.dataset.taskStage = taskStage;
    KanbanDOM.UPDATE_TASK_MODEL.style.display = "block";
    
    const task = TaskRepository.get(projectId, taskStage, Number(taskId));

    KanbanDOM.UPDATE_TASK_TITLE.value = task.title;
    KanbanDOM.UPDATE_TASK_DESCRIPTION.value = task.description;
    KanbanDOM.UPDATE_TASK_DIFFICULT_SELECT.value = task.difficulty;

    KanbanDOM.UPDATE_TASK_ASSIGNED_TO_MULTISELECT.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    task.assignedTo.forEach(userId => {
        const checkbox = KanbanDOM.UPDATE_TASK_ASSIGNED_TO_MULTISELECT.querySelector(`input[type="checkbox"][value="${userId}"]`);
        if (checkbox) checkbox.checked = true;
    });

    updateMultiselectText(KanbanDOM.UPDATE_TASK_ASSIGNED_TO_MULTISELECT);

}

function addTask(){
    const title = KanbanDOM.UPDATE_TASK_TITLE.value.trim();
    const description = KanbanDOM.UPDATE_TASK_DESCRIPTION.value.trim();
    const difficulty = KanbanDOM.UPDATE_TASK_DIFFICULT_SELECT.value;
    const assignedTo = Array.from(
        KanbanDOM.UPDATE_TASK_ASSIGNED_TO_MULTISELECT.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => Number(cb.value));

    const projectId = Number(KanbanDOM.UPDATE_TASK_MODEL.dataset.projectId);
    const previousStage = KanbanDOM.UPDATE_TASK_MODEL.dataset.taskStage;
    const previousTaskId = Number(KanbanDOM.UPDATE_TASK_MODEL.dataset.taskId);

     if (!title) {
        alert("Please enter a title for the task. The task title cannot be empty.");
        return;
    }

     const newTaskId = TaskRepository.create(projectId, {
        title,
        description,
        difficulty,
        assignedTo
    });

    KanbanDOM.UPDATE_TASK_TITLE.value = "";
    KanbanDOM.UPDATE_TASK_DESCRIPTION.value = "";

    TaskRepository.delete(projectId, previousStage, previousTaskId);
    TaskRepository.moveBetweenStages(projectId, newTaskId, "todo", previousStage);

    loadTasks();
    KanbanDOM.UPDATE_TASK_MODEL.style.display = "none";
}

KanbanDOM.UPDATE_TASK_SAVE_BUTTON.addEventListener("click", function(e) {
    e.preventDefault();
    addTask();
});

KanbanDOM.UPDATE_TASK_FORM.addEventListener("submit", function(e) {
    e.preventDefault(); 
    addTask();
});

KanbanDOM.UPDATE_TASK_CLOSE_BUTTON.addEventListener("click", function(e) {
    KanbanDOM.UPDATE_TASK_MODEL.style.display = "none"
})
import { escapeHTML } from "./security.js"
import * as ProjectsDOM from "./DOM/dom.index.js"
import { ProjectRepository } from "./DB/projectRepository.js";

function loadProjectsList(){
    const projectsObjectsList = ProjectRepository.getAll();
    console.log(projectsObjectsList);
    if (projectsObjectsList.length === 0) {
        ProjectsDOM.PROJECTS_LIST_ELEMENT.innerHTML = "<p>No projects available. Please create a new project.</p>";
    }
    else{
        ProjectsDOM.PROJECTS_LIST_ELEMENT.innerHTML = projectsObjectsList.map(projectObject => 
        `<div class="project-item" data-id="${projectObject["projectId"]}">
            <h2>${projectObject["projectName"]}</h2>
            <img src="CSS/Images/Icons/grabage.png" alt="Delete Project" class="delete-project-button">
        </div>`).join("");
    }

}

ProjectsDOM.ADD_NEW_PROJECT_BUTTON.addEventListener("click", function(e) {
    e.preventDefault();
    const projectName = ProjectsDOM.NEW_PROJECT_INPUT.value;

    if(!projectName.trim()){
        alert("Please enter a name for the project. The project name cannot be empty.")
    }

    else {
        ProjectRepository.create(escapeHTML(projectName));
        ProjectsDOM.NEW_PROJECT_INPUT.value = "";
        loadProjectsList();
    }
});

ProjectsDOM.PROJECTS_LIST_ELEMENT.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-project-button")) {
        const projectElement = event.target.closest(".project-item");
        const projectId = Number(projectElement.dataset.id);
        ProjectRepository.delete(projectId)
        loadProjectsList();
    }
    else if(event.target.closest(".project-item")) {
        window.location.href = "kanban.html?projectId=" + event.target.closest(".project-item").dataset.id;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadProjectsList();
});
import { escapeHTML } from "./security.js";

const PROJECTS_LIST_ELEMENT = document.getElementById("project-list");

document.getElementById("add-new-project-button").addEventListener("click", function(e) {
    e.preventDefault();
    const projectNameElement = document.getElementById("new-project-input");

    if(!projectNameElement.value.trim()){
        alert("Please enter a name for the project. The project name cannot be empty.")
    }

    else {
        createProjectInDB(escapeHTML(projectNameElement.value));
        loadProjectsList();
        projectNameElement.value = "";
    }

});

PROJECTS_LIST_ELEMENT.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-project-button")) {
        const projectItem = event.target.closest(".project-item");
        const projectId = projectItem.dataset.name;

        projectItem.remove();
        deleteProjectFromDB(projectId);
    }
    else if(event.target.closest(".project-item")) {
        const projectId = event.target.closest(".project-item").dataset.name;

        window.location.href = "project.html?projectId=" + projectId;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadProjectsList();
});


function loadProjectsList(){
    const projectsObjectsList = getAllProjectsFromDB();
    
    if (projectsObjectsList.length === 0) {
        PROJECTS_LIST_ELEMENT.innerHTML = "<p>No projects available. Please create a new project.</p>";
    }
    else{
        PROJECTS_LIST_ELEMENT.innerHTML = projectsObjectsList.map(projectObject => 
        `<div class="project-item" data-name="${projectObject["projectId"]}">
            <h2>${projectObject["projectName"]}</h2>
            <img src="Images/Icons/grabage.png" alt="Delete Project" class="delete-project-button">
        </div>`).join("");
    }

}
const PROJECTS_LIST_ELEMENT = document.getElementById("project-list");

document.getElementById("add-new-project-button").addEventListener("click", function(e) {
    e.preventDefault();
    const projectNameElement = document.getElementById("new-project-input");
    console.log("Adding new project:", projectNameElement.value);

    if(!projectNameElement.value.trim()){

    }
    else if (isProjectNameExists(projectNameElement.value)) {
        alert("Project with this name already exists.");
    }

    else {
        createProjectInDB(projectNameElement.value);
        loadProjectsList();
        projectNameElement.value = "";
    }

});

PROJECTS_LIST_ELEMENT.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-project-button")) {
        const projectItem = event.target.closest(".project-item");
        const projectName = projectItem.dataset.name;

        projectItem.remove();
        deleteProjectFromDB(projectName);
    }
    else if(event.target.closest(".project-item")) {
        const projectName = event.target.closest(".project-item").dataset.name;

        localStorage.setItem("selectedProject", projectName);
        window.location.href = "project.html?name=" + projectName;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadProjectsList();
});


function loadProjectsList(){
    const projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    PROJECTS_LIST_ELEMENT.innerHTML = projectsList.map(projectName => 
        `<div class="project-item" data-name="${projectName}">
            <h2>${projectName}</h2>
            <img src="Images/Icons/grabage.png" alt="Delete Project" class="delete-project-button">
        </div>`).join("");
}
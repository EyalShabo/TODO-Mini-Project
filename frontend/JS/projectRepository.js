const PROJECTS_ITEMS = "projects";

function createProjectInDB(projectName) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    projectsList.push(projectName);
    localStorage.setItem(PROJECTS_ITEMS, JSON.stringify(projectsList));
    localStorage.setItem(PROJECTS_ITEMS + "_" + projectName, JSON.stringify({
        projectName: projectName,
        todoList: [],
        inProgressList: [],
        doneList: []
    }));
}

function deleteProjectFromDB(projectName) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    projectsList = projectsList.filter(name => name !== projectName);
    localStorage.setItem(PROJECTS_ITEMS, JSON.stringify(projectsList));
    localStorage.removeItem(PROJECTS_ITEMS + "_" + projectName);
}

function isProjectNameExists(projectName) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    return projectsList.includes(projectName);
}
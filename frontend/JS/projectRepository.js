const PROJECTS_ITEMS = "projects";
const PROJECTS_COUNTER_IN_DB = "project-counter"

function getProjectLastId(){
    return Number(localStorage.getItem(PROJECTS_COUNTER_IN_DB) || "0");
}

function createProjectInDB(projectName) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    localStorage.setItem(PROJECTS_COUNTER_IN_DB, getProjectLastId() + 1);

    projectsList.push(getProjectLastId());

    localStorage.setItem(PROJECTS_ITEMS, JSON.stringify(projectsList));
    localStorage.setItem(PROJECTS_ITEMS + "_" + getProjectLastId(), JSON.stringify({
        projectName: projectName,
        projectId: getProjectLastId(),
        todoList: [],
        inProgressList: [],
        doneList: []
    }));
    
}

function deleteProjectFromDB(projectId) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    projectsList = projectsList.filter(item => item !== projectId);
    localStorage.setItem(PROJECTS_ITEMS, JSON.stringify(projectsList));
    localStorage.removeItem(PROJECTS_ITEMS + "_" + projectName);
}
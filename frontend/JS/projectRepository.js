const PROJECTS_ITEMS = "projects";
const PROJECTS_COUNTER_IN_DB = "project-counter"
const TASKS_COUNTER_IN_DB = "task-counter";

function getProjectLastId(){
    return Number(localStorage.getItem(PROJECTS_COUNTER_IN_DB) || "0");
}

function addTheProjectLastIdInOne() {
    localStorage.setItem(PROJECTS_COUNTER_IN_DB, getProjectLastId() + 1);
}

function createProjectInDB(projectName) {
    let projectsList = JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]");
    addTheProjectLastIdInOne();

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

function getProjectFromDB(projectId) {
    return JSON.parse(localStorage.getItem(PROJECTS_ITEMS + "_" + projectId) || null);
}

function getAllProjectsFromDB() {
    return JSON.parse(localStorage.getItem(PROJECTS_ITEMS) || "[]").map(item => {
        return JSON.parse(localStorage.getItem(PROJECTS_ITEMS + "_" + item))
    });
}

function getTaskLastId() {
    return Number(localStorage.getItem(TASKS_COUNTER_IN_DB) || "0");
}

function addTheTaskLastIdInOne() {
    localStorage.setItem(TASKS_COUNTER_IN_DB, getTaskLastId() + 1);
}

function addTaskToProjectInDB(projectId, task) {
    addTheTaskLastIdInOne();
    const project = getProjectFromDB(projectId);
    project.id = getTaskLastId();
    if (project) {
        project.todoList.push(task);
    }
    localStorage.setItem(PROJECTS_ITEMS + "_" + projectId, JSON.stringify(project));
}

function deleteTaskFromProjectInDB(projectId, taskId) {
    const project = getProjectFromDB(projectId);
    if (project) {
        project.todoList = project.todoList.filter(task => task.id !== taskId);
        localStorage.setItem(PROJECTS_ITEMS + "_" + projectId, JSON.stringify(project));
    }
}

function passTaskInDB(projectId, taskId, fromList, toList) {
    const project = getProjectFromDB(projectId);
    if (project) {
        const taskIndex = project[fromList].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const [task] = project[fromList].splice(taskIndex, 1);
            project[toList].push(task);
            localStorage.setItem(PROJECTS_ITEMS + "_" + projectId, JSON.stringify(project));
        }
    }
}
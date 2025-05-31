const PROJECT_IDS_KEY = "projects";
const NEXT_PROJECT_ID_KEY = "projects-counter";

export class ProjectRepository{
    static getNextProjectId(){
        return Number(localStorage.getItem(NEXT_PROJECT_ID_KEY) || "0")
    }

    static incrementProjectIdCounter(){
        localStorage.setItem(NEXT_PROJECT_ID_KEY, this.getNextProjectId() + 1);
    }

    static getProjectStorgeKey(projectId){
        return `${PROJECT_IDS_KEY}_${projectId}`;
    }

    static create(projectName){
        let projectIdsList = this.getIdsList();
        let projectId = this.getNextProjectId();
        this.incrementProjectIdCounter();

        projectIdsList.push(projectId);

        localStorage.setItem(PROJECT_IDS_KEY, JSON.stringify(projectIdsList));
        localStorage.setItem(this.getProjectStorgeKey(projectId), JSON.stringify({
            projectName: projectName,
            projectId: projectId,
            todo: [],
            inProgress: [],
            done: []
        }));
    }

    static delete(projectId){
        localStorage.setItem(PROJECT_IDS_KEY, JSON.stringify(this.getIdsList().filter(item => item !== projectId)));
        localStorage.removeItem(this.getProjectStorgeKey(projectId));
    }

    static get(projectId){
        return JSON.parse(localStorage.getItem(this.getProjectStorgeKey(projectId)) || null);
    }

    static getIdsList(){
        return JSON.parse(localStorage.getItem(PROJECT_IDS_KEY) || "[]");
    }

    static getAll() {
        return this.getIdsList().map(projectId => {
            return JSON.parse(localStorage.getItem(this.getProjectStorgeKey(projectId)));
        });
    }
}

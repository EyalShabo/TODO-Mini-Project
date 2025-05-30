import { ProjectRepository } from "./projectRepository.js";

const NEXT_TASK_ID_KEY = "task-counter";

export class TaskRepository{
    static getNextTaskId(){
        return Number(localStorage.getItem(NEXT_TASK_ID_KEY) || "0")
    }

    static incrementTaskIdCounter(){
        localStorage.setItem(NEXT_TASK_ID_KEY, this.getNextTaskId + 1);
    }

    static create(projectId, taskJson){
        const taskId = this.getNextTaskId();
        const project = ProjectRepository.get(projectId)

        task.id = taskId;

        if (project) {
            project.todoList.push(task);
            localStorage.setItem(ProjectRepository.getProjectStorgeKey(projectId), JSON.stringify(project));
        }
        
    }

    static delete(projectId, taskId){
        const project = ProjectRepository.get(projectId)

        if(project){
            project.todoList = project.todoList.filter(task => task.id !== taskId);
            localStorage.setItem(ProjectRepository.getProjectStorgeKey(projectId), JSON.stringify(project));
        }
    }

    static moveBetweenStages(projectId, taskId, fromList, toList){
        const project = ProjectRepository.get(projectId)

        if (project) {
            const taskIndex = project[fromList].findIndex(task => task.id === taskId);

            if (taskIndex !== -1) {
                const [task] = project[fromList].splice(taskIndex, 1);
                project[toList].push(task);
                localStorage.setItem(ProjectRepository.getProjectStorgeKey(projectId), JSON.stringify(project));
            }
        }
    }
}

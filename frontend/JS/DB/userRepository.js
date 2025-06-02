const NEXT_USER_ID_KEY = "user-counter";
const USERS_STORGE_KEY = "users";

export class UserRepository{
    static getNextUserId(){
        return Number(localStorage.getItem(NEXT_USER_ID_KEY) || "0")
    }

    static incrementUserIdCounter(){
        localStorage.setItem(NEXT_USER_ID_KEY, this.getNextUserId() + 1);
    }

    static create(userJson){
        const userId = this.getNextUserId();
        userJson.id = userId;

        const users = JSON.parse(localStorage.getItem(USERS_STORGE_KEY) || "[]");
        users.push(userJson);
        localStorage.setItem(USERS_STORGE_KEY, JSON.stringify(users));
        
        this.incrementUserIdCounter();
    }

    static delete(userId){
        let users = JSON.parse(localStorage.getItem(USERS_STORGE_KEY) || "[]");
        users = users.filter(user => user.id !== userId);
        localStorage.setItem(USERS_STORGE_KEY, JSON.stringify(users));
    }

    static getUserObject(userId){
        let users = JSON.parse(localStorage.getItem(USERS_STORGE_KEY) || "[]");
        return users.find(user => user.id === userId) ;
    }

    static getList(){
        return JSON.parse(localStorage.getItem(USERS_STORGE_KEY) || "[]");
    }
}

import { escapeHTML } from "./security.js"
import * as UsersDOM from "./DOM/dom.users.js"
import { UserRepository } from "./DB/userRepository.js";

function loadUsersList(){
    const usersObjectList = UserRepository.getList();

    if(usersObjectList.length === 0){
        UsersDOM.USER_LIST_ELEMENT.innerHTML = "<p>No Users available. Please create a new user.</p>";
    }
    else {
        UsersDOM.USER_LIST_ELEMENT.innerHTML = usersObjectList.map(userObject => 
            `<div class="user-item" data-id="${userObject["id"]}">
                <h2>${escapeHTML(userObject["name"])}</h2>
                <img src="CSS/Images/Icons/grabage.png" alt="User Project" class="delete-user-button">
            </div>`).join("");
    }
}

function addUser(){
    const name = UsersDOM.NEW_USER_INPUT.value;

    if(!name.trim()){
        alert("Please enter a name. Name cannot be empty.")
    }

    else if(UserRepository.getList().some(user => user.name.toLowerCase() === name.toLowerCase())){
        alert("This name already exists in the system.");   
    }
    else{
        UserRepository.create({name: name})
        UsersDOM.NEW_USER_INPUT.value = "";
        loadUsersList();
    }
}

UsersDOM.ADD_NEW_USER_BUTTON.addEventListener("click", function(e) {
    e.preventDefault();
   addUser();
})

UsersDOM.NEW_USER_FORM.addEventListener("submit", function(e) {
    e.preventDefault();
    addUser();
});


UsersDOM.USER_LIST_ELEMENT.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-user-button")) {
        const userElement = event.target.closest(".user-item");
        const userId = Number(userElement.dataset.id);
        UserRepository.delete(userId)
        loadUsersList();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadUsersList();
});
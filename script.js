//selectors
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("add-note");
const listElement = document.getElementById("list");
const notifyEle = document.querySelector(".notification");

//variables
let notes = JSON.parse(localStorage.getItem('todos')) || []; // when you want to store data in local system
//let notes = []; // array of todo list
let editTodoId = -1; 

//first render of todos to retrieve previously saved todos
addNotes();  //for local storage

//submit the notes as in form we do
form.addEventListener("submit", function(event){
    event.preventDefault();

    saveNote();
    addNotes();
    localStorage.setItem('todos', JSON.stringify(notes));
});

//saving notes function
function saveNote(){
    const todoValue = todoInput.value;

    //check for duplicate note
    const isDuplicate = notes.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());


    //check if todoValue is empty
    const isEmpty = todoValue === '';
    if(isEmpty){
        //alert("TO do input is empty!!!");
        showNotification("To do input is empty!!!");
    } 
    else if (isDuplicate) {
        // alert("Todo already exists!!!");
        showNotification("Todo already exists!!!");
    } 
    else{
        if(editTodoId >= 0){  // editing
            //update edited notes
            notes = notes.map((todo, index) => ({
                
                    ...todo,
                    value : index === editTodoId ? todoValue : todo.value,
                
            }));
            editTodoId = -1;
        }
        else {
            //save your todo to array notes
            notes.push({
            value: todoValue,
            checked: false,
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
        });
        }
        
        todoInput.value = '';
    }

    

}

//render to / add notes
function addNotes() {
    if(notes.length === 0){
        listElement.innerHTML = '<center>Nothing todo !!!</center>';
        return 
    }
    //clear element before a re-render
    listElement.innerHTML = "";

    //render todo
    notes.forEach((todo, index) => {
        listElement.innerHTML += `
        <div class="todo" id=${index}>
            <i
             class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
             styles = "color : ${todo.color}"
             data-action="check"
             ></i>
            <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div> `
    
    })
}

//click event listener for all todo
listElement.addEventListener("click", (event) => {
    const target = event.target;
    const parentEle = target.parentNode;

    if(parentEle.className !== 'todo') return;

    //notes id
    const todo = parentEle;
    const todoId = Number(todo.id);

    //target action
    const action = target.dataset.action;

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);

    //console.log(todoId, action);
});

//if the todo is checked function
function checkTodo(todoId){
    
    notes = notes.map((todo, index) =>{
        if(index === todoId){
            return{
                value: todo.value,
                color: todo.color,
                checked: !todo.checked
            }
        }
        else{
            return{
                value: todo.value,
                color: todo.color,
                checked: todo.checked
            }
        }

        // ({
        //     ...todo,
        //     checked: index === todoId ? !todo.checked : todo.checked
        // })
    });
    addNotes();

}

//edit a todo
function editTodo(todoId){
    todoInput.value = notes[todoId].value;

    editTodoId = todoId;
}

//delete a todo
function deleteTodo(todoId){
 notes = notes.filter((todo, index) => index !== todoId);
 
 //re-render todo
 addNotes();
 localStorage.setItem('todos', JSON.stringify(notes));
}

function showNotification(notice) {
    //change msg
    notifyEle.innerHTML = notice;

    //notification enter
    notifyEle.classList.add("notif-enter");

    //notification removed after 4 seconds
    setTimeout(() =>{
        notifyEle.classList.remove("notif-enter")
    }, 3000)
}
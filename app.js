const todoText = document.getElementById("todoText");
const todoDate = document.getElementById("todoDate");
const addButton = document.querySelector(".addTodo");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllTodo = document.getElementById("delete-button");
const editButton = document.querySelector(".editTodo");
const filterButton = document.querySelectorAll("#filter-button");
// TODOS
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// STORAGE TODO IN THE LOCALSTORAGE
const storageTodo = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// CREATE ID
const generateId = () => {
  return Math.round(Math.random() * Math.random() * Math.pow(10, 15));
};

// SHOW MESSAGE FOR SUCCESS OR ERROR
const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert", `alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

// DYNAMIC EDIT TODO LIST
const todoDisplay = (data) => {
  const filterTodos = data || todos;
  todosBody.innerHTML = "";
  if (!filterTodos.length) {
    todosBody.innerHTML = "<tr><td colspan=4>No task found</td></tr>";
    return;
  }
  filterTodos.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "No date"}</td>
      <td>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
        <button onclick="editHandler('${todo.id}')">Edit</button>
        <button onclick="toggleHandler('${todo.id}')">${
      todo.completed ? "Undo" : "Do"
    }</button>
        <button onclick="deleteHandler('${todo.id}')">Delete</button>
      </td>
    </tr>
    `;
  });
};

// ADD HANDLER FOR TODO TASK AND DATE
const addHandler = () => {
  const task = todoText.value.trim();
  const date = todoDate.value;
  const todo = {
    id: generateId(),
    completed: false,
    task,
    date,
  };
  if (task) {
    todos.push(todo);
    storageTodo();
    todoDisplay();
    todoText.value = "";
    todoDate.value = "";

    showAlert("Todo added successfully", "success");
  } else {
    showAlert("Todo is not added", "error");
  }
};

// DELETE HANDLER FOR ALL TODO
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    storageTodo();
    todoDisplay();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No task for clearing", "error");
  }
};

// DELETE UNIQUE TODO IN THE LIST
const deleteHandler = (id) => {
  todos = todos.filter((todo) => todo.id !== parseInt(id));
  storageTodo();
  todoDisplay();
  showAlert("This task deleted successfully", "success");
};
//CHANGE STATUS WITH BUTTON
const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === parseInt(id));
  todo.completed = !todo.completed;
  console.log(todo);
  storageTodo();
  todoDisplay();
  showAlert("todo status changed successfully", "success");
};
//TODO EDIT HANDLER FOR TASK AND DATE
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === parseInt(id));
  todoText.value = todo.task;
  todoDate.value = todo.date;
  editButton.style.display = "inline-block";
  addButton.style.display = "none";
  editButton.dataset.id = id;
};
const applyEditHandler = (e) => {
  const id = e.target.dataset.id;
  const todo = todos.find((todo) => todo.id === parseInt(id));
  todo.task = todoText.value;
  todo.date = todoDate.value;
  todoText.value = "";
  todoDate.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  storageTodo();
  todoDisplay();
  showAlert("todo edit successfully", "success");
};
//FILTER BY USER REQUEST FOR PENDING OR COMPLETED
const filterHandler = (e) => {
  let filteredTodos = null;
  const filter = e.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  todoDisplay(filteredTodos);
};
// EVENT LISTENER
window.addEventListener("load", () => todoDisplay());
addButton.addEventListener("click", addHandler);
deleteAllTodo.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButton.forEach((filterBtn) =>
  filterBtn.addEventListener("click", filterHandler)
);
todoText.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addHandler();
  }
});
todoDate.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addHandler();
  }
});
const AddToDo = document.getElementById("AddToDo");
const ToDoText = document.getElementById("ToDoText");
const DueDate = document.getElementById("dueDateInput");
const filterSelect = document.querySelector(".custom-select"); // Select the dropdown

let tasks = []; // Array to store task objects

function saveToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks; // Return the tasks array or an empty array if no data exists
}


// Add event listener for the Add button
AddToDo.addEventListener("click", function () {
    let newTask = ToDoText.value.trim();
    let DueDateOfTask = DueDate.value.trim();

    if (newTask === "" || DueDateOfTask === "") {
        alert("Please enter a task and its due date!");
        return;
    }

    // Create a new task object
    const taskObject = {
        id: Date.now(), // Unique ID for the task
        task: newTask,
        dueDate: DueDateOfTask,
        completed: false, // Default state
    };

    // Add to the task list and save to localStorage
    tasks.push(taskObject);
    saveToLocalStorage(tasks);

    // Clear the input fields
    ToDoText.value = "";
    DueDate.value = "";

    // Render the updated task list
    renderTasks();
});


// Function to render tasks based on filter
function renderTasks() {
    const todoList = document.querySelector(".todo-list");
    todoList.innerHTML = ""; // Clear the existing list

    tasks.forEach((task) => {
        // Create the task container
        const newDiv = document.createElement("div");
        newDiv.classList.add("todo-item", "d-flex", "align-items-center", "justify-content-between", "mb-3", "p-2", "rounded");
        newDiv.style.backgroundColor = "#f8f9fa";

        // Create task content
        const taskContent = document.createElement("div");
        taskContent.classList.add("d-flex", "align-items-center");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.classList.add("mr-3");

        // Strike-through completed tasks
        checkbox.addEventListener("change", function () {
            task.completed = this.checked;
            saveToLocalStorage(tasks);
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.task;
        if (task.completed) taskText.style.textDecoration = "line-through";

        const dueDateText = document.createElement("span");
        dueDateText.textContent = ` (Due: ${new Date(task.dueDate).toLocaleDateString()})`;
        dueDateText.style.marginLeft = "10px";
        dueDateText.style.fontSize = "0.9rem";
        dueDateText.style.color = "#6c757d";

        // Append checkbox and texts
        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        taskContent.appendChild(dueDateText);

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.style.marginLeft = "10px";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter((t) => t.id !== task.id);
            saveToLocalStorage(tasks);
            renderTasks();
        });

        // Append task content and delete button to the task container
        newDiv.appendChild(taskContent);
        newDiv.appendChild(deleteButton);

        // Append task container to the todo list
        todoList.appendChild(newDiv);
    });
}


// Event listener for filter changes
filterSelect.addEventListener("change", renderTasks);


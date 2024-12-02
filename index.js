// DOM Elements
const AddToDo = document.getElementById("AddToDo");
const ToDoText = document.getElementById("ToDoText");
const DueDate = document.getElementById("dueDateInput");
const filterSelect = document.querySelector(".custom-select"); // Dropdown filter
const todoList = document.querySelector(".todo-list"); // Task list container

// Global task list
let tasks = [];

// Function to save tasks to local storage
function saveToLocalStorage() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Failed to save task. Local storage may be full.");
    }
}

// Function to load tasks from local storage
function loadFromLocalStorage() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}

// Function to render tasks with filtering
function renderTasks() {
    todoList.innerHTML = ""; // Clear the list

    // Get the current filter value
    const filter = filterSelect.value;

    // Filter tasks based on the selected filter
    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") {
            return task.completed;
        } else if (filter === "active") {
            return !task.completed;
        } else if (filter === "has-due-date") {
            return task.dueDate !== "";
        } else {
            return true; // Default to all tasks
        }
    });

    // Render each filtered task
    filteredTasks.forEach((task) => {
        // Task container
        const newDiv = document.createElement("div");
        newDiv.classList.add(
            "todo-item",
            "d-flex",
            "align-items-center",
            "justify-content-between",
            "mb-3",
            "p-2",
            "rounded"
        );
        newDiv.style.backgroundColor = "#f8f9fa";

        // Task content
        const taskContent = document.createElement("div");
        taskContent.classList.add("d-flex", "align-items-center");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.classList.add("mr-3");

        // Strike-through completed tasks
        checkbox.addEventListener("change", function () {
            task.completed = this.checked;
            saveToLocalStorage();
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

        // Append content to the task item
        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        taskContent.appendChild(dueDateText);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.style.marginLeft = "10px";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter((t) => t.id !== task.id);
            saveToLocalStorage();
            renderTasks();
        });

        // Append content and button to the task container
        newDiv.appendChild(taskContent);
        newDiv.appendChild(deleteButton);

        // Add task to the list
        todoList.appendChild(newDiv);
    });
}

// Add new task
AddToDo.addEventListener("click", function () {
    const newTask = ToDoText.value.trim();
    const dueDateOfTask = DueDate.value.trim();

    if (newTask === "" || dueDateOfTask === "") {
        alert("Please enter a task and its due date!");
        return;
    }

    // Create a new task object
    const taskObject = {
        id: Date.now(), // Unique ID
        task: newTask,
        dueDate: dueDateOfTask,
        completed: false, // Default state
    };

    // Add task to the array and save
    tasks.push(taskObject);
    saveToLocalStorage();

    // Clear input fields
    ToDoText.value = "";
    DueDate.value = "";

    // Render updated tasks
    renderTasks();
});

// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    renderTasks();
});

// Add event listener for filter changes
filterSelect.addEventListener("change", renderTasks);

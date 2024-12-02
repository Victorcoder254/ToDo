const AddToDo = document.getElementById("AddToDo");
const ToDoText = document.getElementById("ToDoText");
const DueDate = document.getElementById("dueDateInput");
const filterSelect = document.querySelector(".custom-select"); // Select the dropdown

let tasks = []; // Array to store task objects

// Add event listener for the Add button
AddToDo.addEventListener("click", function () {
    let newTask = ToDoText.value.trim(); // Get the task text and trim whitespace
    let DueDateOfTask = DueDate.value.trim(); // Get the due date

    if (newTask === "" || DueDateOfTask === "") {
        alert("Please enter a task! And Its Due Date"); // Prevent empty inputs
        return;
    }

    // Clear the input fields
    ToDoText.value = "";
    DueDate.value = "";

    // Create a task object and add it to the array
    const task = {
        id: Date.now(), // Unique ID
        text: newTask,
        dueDate: DueDateOfTask,
        completed: false, // Initially not completed
    };
    tasks.push(task);

    renderTasks(); // Re-render tasks
});

// Function to render tasks based on filter
function renderTasks() {
    const todoList = document.querySelector(".todo-list");
    todoList.innerHTML = ""; // Clear the list

    // Determine the filter
    const filter = filterSelect.value;

    // Filter tasks based on the selected option
    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        if (filter === "has-due-date") return task.dueDate !== "";
    });

    // Render filtered tasks
    filteredTasks.forEach((task) => {
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
        newDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

        const taskContent = document.createElement("div");
        taskContent.classList.add("d-flex", "align-items-center");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.classList.add("mr-3");

        // Update task completion status
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks(); // Re-render tasks after updating
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.style.textDecoration = task.completed ? "line-through" : "none";

        const dueDateText = document.createElement("span");
        dueDateText.textContent = ` (Due: ${new Date(task.dueDate).toLocaleDateString()})`;
        dueDateText.style.marginLeft = "10px";
        dueDateText.style.fontSize = "0.9rem";
        dueDateText.style.color = "#6c757d";

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        taskContent.appendChild(dueDateText);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.style.marginLeft = "10px";

        // Remove task on delete
        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter((t) => t.id !== task.id);
            renderTasks(); // Re-render tasks
        });

        newDiv.appendChild(taskContent);
        newDiv.appendChild(deleteButton);
        todoList.appendChild(newDiv);
    });
}

// Event listener for filter changes
filterSelect.addEventListener("change", renderTasks);

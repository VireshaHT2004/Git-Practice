let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditId = null;

const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const saveBtn = document.getElementById("saveBtn");

titleInput.addEventListener("input", () => {
    saveBtn.disabled = titleInput.value.trim() === "";
});

function renderTasks() {
    const todoList = document.getElementById("todoList");
    const completedList = document.getElementById("completedList");

    todoList.innerHTML = "";
    completedList.innerHTML = "";

    const todos = tasks
        .filter(task => !task.completed)
        .sort((a, b) => a.id - b.id);

    const completed = tasks
        .filter(task => task.completed)
        .sort((a, b) => b.id - a.id);

    todos.forEach(task => {
        todoList.appendChild(createTaskCard(task, false));
    });

    completed.forEach(task => {
        completedList.appendChild(createTaskCard(task, true));
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskCard(task, isCompleted) {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
        <div class="task-id">${task.id}</div>
        <div class="task-details">
            <div class="task-title">${task.title}</div>
            <div class="task-desc">${task.description || ""}</div>
        </div>
    `;

    if (!isCompleted) {
        const actions = document.createElement("div");
        actions.className = "task-actions";

        actions.innerHTML = `
            <button class="edit-btn" onclick="editTask(${task.id})">✏</button>
            <button class="done-btn" onclick="markDone(${task.id})">✔</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
        `;

        card.appendChild(actions);
    }

    return card;
}

function saveTask() {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (currentEditId !== null) {
        const task = tasks.find(t => t.id === currentEditId);
        task.title = title;
        task.description = description;
    } else {
        const activeTodos = tasks.filter(t => !t.completed);

        if (activeTodos.length >= 4) {
            alert("Maximum 4 tasks allowed in Todo list.");
            return;
        }

        const newId = tasks.length > 0
            ? Math.max(...tasks.map(t => t.id)) + 1
            : 1;

        tasks.push({
            id: newId,
            title: title,
            description: description,
            completed: false
        });
    }

    clearForm();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);

    titleInput.value = task.title;
    descInput.value = task.description;

    currentEditId = id;
    saveBtn.disabled = false;
}

function cancelEdit() {
    clearForm();
}

function clearForm() {
    titleInput.value = "";
    descInput.value = "";
    currentEditId = null;
    saveBtn.disabled = true;
}

function markDone(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = true;
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

renderTasks();
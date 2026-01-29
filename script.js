// ---------- AUTH SYSTEM ----------

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return showMessage("Fill all fields");

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[email]) return showMessage("User already exists!");

  users[email] = { password, tasks: [] };
  localStorage.setItem("users", JSON.stringify(users));
  showMessage("Account created! Please login.");
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[email] || users[email].password !== password) {
    return showMessage("Invalid credentials");
  }

  localStorage.setItem("loggedInUser", email);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function showMessage(msg) {
  document.getElementById("authMessage").textContent = msg;
}

// Redirect if not logged in
if (window.location.pathname.includes("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "index.html";
}

// ---------- TASK SYSTEM ----------

function getCurrentUserData() {
  const email = localStorage.getItem("loggedInUser");
  let users = JSON.parse(localStorage.getItem("users"));
  return users[email];
}

function saveUserData(data) {
  const email = localStorage.getItem("loggedInUser");
  let users = JSON.parse(localStorage.getItem("users"));
  users[email] = data;
  localStorage.setItem("users", JSON.stringify(users));
}

function addTask() {
  const name = document.getElementById("taskName").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!name) return alert("Enter task name");

  let userData = getCurrentUserData();

  userData.tasks.push({
    name,
    dueDate,
    priority,
    completed: false
  });

  saveUserData(userData);
  renderTasks();
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";
  let userData = getCurrentUserData();

  userData.tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;

    const li = document.createElement("li");
    li.className = task.priority.toLowerCase();

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
      <span>${task.name} (Due: ${task.dueDate})</span>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">X</button>
    `;

    list.appendChild(li);
  });
}

function toggleTask(i) {
  let userData = getCurrentUserData();
  userData.tasks[i].completed = !userData.tasks[i].completed;
  saveUserData(userData);
  renderTasks();
}

function deleteTask(i) {
  let userData = getCurrentUserData();
  userData.tasks.splice(i, 1);
  saveUserData(userData);
  renderTasks();
}

function editTask(i) {
  let userData = getCurrentUserData();
  const newName = prompt("Edit task", userData.tasks[i].name);
  if (newName) userData.tasks[i].name = newName;
  saveUserData(userData);
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function searchTasks() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const items = document.querySelectorAll("#taskList li");

  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(search) ? "flex" : "none";
  });
}

renderTasks();

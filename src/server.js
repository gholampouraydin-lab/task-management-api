const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

let nextUserId = 1;
let nextTaskId = 1;
const users = [];
const tasks = [];

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/v1/users", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ error: "Email already exists" });
  }
  const user = { id: nextUserId++, name, email, password, createdAt: new Date().toISOString() };
  users.push(user);
  const { password: _password, ...safeUser } = user;
  return res.status(201).json(safeUser);
});

app.get("/api/v1/users", (_req, res) => {
  res.json(users.map(({ password: _password, ...user }) => user));
});

app.get("/api/v1/users/:userId", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.userId));
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _password, ...safeUser } = user;
  return res.json(safeUser);
});

app.patch("/api/v1/users/:userId", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.userId));
  if (!user) return res.status(404).json({ error: "User not found" });
  const { name, email } = req.body || {};
  if (email && users.some((item) => item.email === email && item.id !== user.id)) {
    return res.status(409).json({ error: "Email already exists" });
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  const { password: _password, ...safeUser } = user;
  return res.json(safeUser);
});

app.delete("/api/v1/users/:userId", (req, res) => {
  const index = users.findIndex((item) => item.id === Number(req.params.userId));
  if (index < 0) return res.status(404).json({ error: "User not found" });
  users.splice(index, 1);
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].userId === Number(req.params.userId)) tasks.splice(i, 1);
  }
  return res.status(204).end();
});

app.post("/api/v1/tasks", (req, res) => {
  const { userId, title, description = "", status = "todo", dueDate = null } = req.body || {};
  if (!userId || !title) {
    return res.status(400).json({ error: "userId and title are required" });
  }
  if (!users.some((user) => user.id === Number(userId))) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!["todo", "in_progress", "done"].includes(status)) {
    return res.status(422).json({ error: "Invalid task status" });
  }
  const now = new Date().toISOString();
  const task = { id: nextTaskId++, userId: Number(userId), title, description, status, dueDate, createdAt: now, updatedAt: now };
  tasks.push(task);
  return res.status(201).json(task);
});

app.get("/api/v1/tasks", (req, res) => {
  const userId = req.query.userId ? Number(req.query.userId) : null;
  return res.json(userId ? tasks.filter((task) => task.userId === userId) : tasks);
});

app.get("/api/v1/tasks/:taskId", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.taskId));
  if (!task) return res.status(404).json({ error: "Task not found" });
  return res.json(task);
});

app.patch("/api/v1/tasks/:taskId", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.taskId));
  if (!task) return res.status(404).json({ error: "Task not found" });
  const { title, description, status, dueDate } = req.body || {};
  if (status !== undefined && !["todo", "in_progress", "done"].includes(status)) {
    return res.status(422).json({ error: "Invalid task status" });
  }
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;
  task.updatedAt = new Date().toISOString();
  return res.json(task);
});

app.delete("/api/v1/tasks/:taskId", (req, res) => {
  const index = tasks.findIndex((item) => item.id === Number(req.params.taskId));
  if (index < 0) return res.status(404).json({ error: "Task not found" });
  tasks.splice(index, 1);
  return res.status(204).end();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task Management API listening on port ${PORT}`);
});

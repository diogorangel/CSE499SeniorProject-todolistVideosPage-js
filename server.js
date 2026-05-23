const express = require('express');
const db = require('./database/database'); // Make sure the path is correct
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.'));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// READ: List all tasks/exercises
app.get('/api/tasks', (req, res) => {
    // Map database column names to the attributes the front end expects
    const sql = `SELECT id, task_name AS taskName, due_date AS dueDate, description, assignee, creator, completed FROM tasks`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Convert SQLite 0/1 value to true/false boolean
        const formattedRows = rows.map(row => ({
            ...row,
            completed: !!row.completed
        }));
        res.json(formattedRows);
    });
});

// Root: Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Todolist.html'));
});

// CREATE: Add a new task/exercise
app.post('/api/tasks', (req, res) => {
    const { taskName, dueDate, description, assignee, creator } = req.body;
    const sql = `INSERT INTO tasks (task_name, due_date, description, assignee, creator, completed) VALUES (?, ?, ?, ?, ?, 0)`;
    
    db.run(sql, [taskName, dueDate, description, assignee || 'Diogo Rangel', creator || 'Sistema'], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, taskName, dueDate, description, assignee, creator, completed: false });
    });
});

// UPDATE: Update completion status (Complete / Undo)
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    // Convert JavaScript boolean to SQLite 0 or 1
    const completedValue = completed ? 1 : 0;
    const sql = `UPDATE tasks SET completed = ? WHERE id = ?`;

    db.run(sql, [completedValue, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: Number(id), completed });
    });
});

// DELETE: Remove the task/exercise from the database
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Return status 200 success so front-end if (response.ok) works
        res.json({ message: "Task deleted successfully", id: Number(id) });
    });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js server running smoothly at http://localhost:${PORT}`);
});
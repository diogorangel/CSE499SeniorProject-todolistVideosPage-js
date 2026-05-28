const express = require('express');
const db = require('./database/database'); // This imports your createTask, getTasks, etc.
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.'));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get('/api/tasks', (req, res) => {
    const sql = `SELECT tasks.*, users.username FROM tasks LEFT JOIN users ON tasks.assignee_id = users.id`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Todolist.html'));
});

// API Route to add a task to SQL
app.post('/api/tasks', (req, res) => {
    const { name, date, desc, userId } = req.body;
    const sql = `INSERT INTO tasks (task_name, due_date, description, assignee_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, date, desc, userId || 1], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// API Route to delete a task from SQL
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
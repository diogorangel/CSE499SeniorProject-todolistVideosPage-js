const taskNameInput = document.getElementById('taskName');
const assigneeInput = document.getElementById('assignee');
const creatorInput = document.getElementById('creator');
const taskDateInput = document.getElementById('taskDate');
const descriptionInput = document.getElementById('description');
const addButton = document.getElementById('addButton');

async function renderCards() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed === 1 || task.completed === true).length;

        const taskCounter = document.getElementById('taskCounter');
        if (taskCounter) {
            taskCounter.innerText = `Total Tasks: ${totalTasks} | Completed: ${completedTasks}`;
        }

        const cardContainer = document.getElementById('cardContainer');
        if (!cardContainer) return;
        cardContainer.innerHTML = ''; 

        tasks.forEach((task) => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;

            card.innerHTML = `
                <h3>${task.taskName || 'Untitled Task'}</h3>
                <p><span class="label">Due Date:</span> ${task.dueDate || 'N/A'}</p>
                <p><span class="label">Assignee:</span> ${task.assignee || 'None'}</p>
                <p><span class="label">Created by:</span> ${task.creator || 'None'}</p>
                <p><span class="label">One Word Focus:</span> <strong>${task.oneWord || 'N/A'}</strong></p>
                <p><span class="label">Notes:</span> ${task.description || 'No notes added.'}</p>
                
                <div class="card-actions">
                    <button class="complete-btn" onclick="toggleComplete(${task.id}, ${task.completed})">
                        ${task.completed ? '🔄 Undo' : '✅ Complete'}
                    </button>
                    <button class="delete-btn" onclick="deleteCard(${task.id})">🗑️ Delete</button>
                </div>
            `;
            cardContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching or rendering tasks:", error);
    }
}

if (addButton) {
    addButton.addEventListener('click', async () => {
        const taskName = taskNameInput.value.trim();
        const dueDate = taskDateInput.value;
        const assignee = assigneeInput.value;
        const creator = creatorInput.value;
        const oneWord = document.getElementById('oneWord') ? document.getElementById('oneWord').value.trim() : '';
        const description = descriptionInput.value.trim();

        if (!taskName) {
            alert("Please give your task a name!");
            return;
        }

        const newTask = {
            taskName,
            dueDate,
            assignee,
            creator,
            oneWord,
            description,
            completed: false
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                alert("✅ Exercise successfully added to routine!");
                taskNameInput.value = '';
                taskDateInput.value = '';
                assigneeInput.value = '';
                creatorInput.value = '';
                if (document.getElementById('oneWord')) document.getElementById('oneWord').value = '';
                descriptionInput.value = '';

                renderCards(); 
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    });
}

async function toggleComplete(id, currentStatus) {
    try {
        const updatedStatus = !currentStatus;
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: updatedStatus })
        });
        renderCards();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

async function deleteCard(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        renderCards();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

function checkEditable(selectElement) {
    if (selectElement.value === "CUSTOM_OPTION") {
        const fieldName = selectElement.id === "assignee"
            ? "assignee name"
            : selectElement.id === "creator"
                ? "creator name"
                : "task name";
        
        const customText = prompt(`Enter your custom ${fieldName}:`);
        
        if (customText && customText.trim() !== "") {
            const cleanText = customText.trim();
            
            const newOption = document.createElement("option");
            newOption.value = cleanText;
            newOption.text = cleanText;
            newOption.selected = true;
            
            selectElement.add(newOption, selectElement.options[selectElement.options.length - 1]);
        } else {
            selectElement.value = "";
        }
    }
}

window.checkEditable = checkEditable;
document.addEventListener('DOMContentLoaded', renderCards);
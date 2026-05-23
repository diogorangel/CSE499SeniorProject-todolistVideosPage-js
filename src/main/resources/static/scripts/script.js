// DOM Element References
const taskNameInput = document.getElementById('taskName');
const assigneeInput = document.getElementById('assignee');
const creatorInput = document.getElementById('creator');
const taskDateInput = document.getElementById('taskDate');
const descriptionInput = document.getElementById('description');
const addButton = document.getElementById('addButton');

/**
 * Renders tasks fetched from the SQLite database (Node.js API)
 */
async function renderCards() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();

        // Calculates total and completed tasks by mapping the 'completed' field (0 or 1 in SQLite)
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed === 1 || task.completed === true).length;

        // Updates the counter on the screen
        const taskCounter = document.getElementById('taskCounter');
        if (taskCounter) {
            taskCounter.innerText = `Total Tasks: ${totalTasks} | Completed: ${completedTasks}`;
        }

        // Selects the card container
        const cardContainer = document.getElementById('cardContainer');
        if (!cardContainer) return;
        cardContainer.innerHTML = ''; // Clears the container before rendering

        // Builds each card with the exact properties returned by your SQLite database
        tasks.forEach((task) => {
            const card = document.createElement('div');

            // Checks if it is marked as completed (SQLite stores 1 for true, 0 for false)
            const isTaskCompleted = task.completed === 1 || task.completed === true;

            card.className = `task-card ${isTaskCompleted ? 'completed' : ''}`;

            card.innerHTML = `
                        <h3>${task.taskName || 'No Name'}</h3>
                        <p><strong>Due Date:</strong> ${task.dueDate || 'No date set'}</p>
                        <p><strong>Assignee:</strong> ${task.assignee || 'Unassigned'}</p>
                        <p><strong>Creator:</strong> ${task.creator || 'No creator'}</p>
                        <p><strong>Description:</strong> ${task.description || 'No description provided'}</p>
                        
                        <div class="card-actions">
                            <button type="button" class="complete-btn" onclick="toggleComplete(${task.id}, ${isTaskCompleted})">
                                ${isTaskCompleted ? '⏹️ Undo' : '✅ Complete'}
                            </button>
                            <button type="button" class="delete-btn" onclick="removeTask(${task.id})">
                                ❌ Delete
                            </button>
                        </div>
                    `;

            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to render cards:", error);
    }
}

/**
 * Sends a new task to the Express API
 */
if (addButton) {
    addButton.addEventListener('click', async () => {
        const taskName = taskNameInput ? taskNameInput.value.trim() : '';
        const dueDate = taskDateInput ? taskDateInput.value : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const assignee = assigneeInput ? assigneeInput.value : '';
        const creator = creatorInput ? creatorInput.value : '';

        if (!taskName) {
            alert("Please choose or enter a task name.");
            return;
        }

        if (!assignee) {
            alert("Please choose or enter an assignee.");
            return;
        }

        if (!creator) {
            alert("Please choose or enter a creator.");
            return;
        }

        if (!description) {
            alert("Please enter a description.");
            return;
        }

        // Request body configuration - Captures the values selected in the <select> fields
        const newTask = {
            taskName,
            dueDate,
            description,
            assignee,
            creator
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                clearInputs();
                renderCards();
            }
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    });
}

/**
 * Updates the completion status in SQLite
 */
async function toggleComplete(id, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: newStatus })
        });
        renderCards();
    } catch (error) {
        console.error("Failed to toggle complete:", error);
    }
}

/**
 * Removes a task via the DELETE route
 */
async function removeTask(id) {
    const userConfirmed = confirm("Do you really want to delete this task?");

    if (userConfirmed) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                renderCards();
            } else {
                alert("Error deleting task.");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }
}

/**
 * Clears the inputs and resets the selects to the disabled default option
 */
function clearInputs() {
    [taskNameInput, assigneeInput, creatorInput, taskDateInput, descriptionInput].forEach(i => {
        if (i) i.value = ''; 
    });
}

/**
 * Allows adding a custom option dynamically to the select menu using a prompt
 */
function checkEditable(selectElement) {
    if (selectElement.value === "CUSTOM_OPTION") {
        // Identifies the field to customize the prompt message
        const fieldName = selectElement.id === "assignee"
            ? "assignee name"
            : selectElement.id === "creator"
                ? "creator name"
                : "task name";
        
        // Opens the dialogue box for typing
        const customText = prompt(`Enter your custom ${fieldName}:`);
        
        if (customText && customText.trim() !== "") {
            const cleanText = customText.trim();
            
            // Dynamically creates the new option
            const newOption = document.createElement("option");
            newOption.value = cleanText;
            newOption.text = cleanText;
            newOption.selected = true;
            
            // Inserts the new option right before the "➕ Type custom..." option (which is the last one)
            selectElement.add(newOption, selectElement.options[selectElement.options.length - 1]);
        } else {
            // If the user cancels or leaves it empty, it goes back to the default empty option
            selectElement.value = "";
        }
    }
}

// Binds the function to the global window scope for compatibility with the HTML onchange attribute
window.checkEditable = checkEditable;

// Executes the initial data load
document.addEventListener('DOMContentLoaded', renderCards);
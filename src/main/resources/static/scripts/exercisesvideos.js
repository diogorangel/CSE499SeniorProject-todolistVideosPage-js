// References to DOM elements
const taskNameInput = document.getElementById('taskName');
const assigneeInput = document.getElementById('assignee');
const creatorInput = document.getElementById('creator');
const taskDateInput = document.getElementById('taskDate'); 
const descriptionInput = document.getElementById('description');
const addButton = document.getElementById('addButton');
const cardContainer = document.getElementById('cardContainer');

// Utility function to detect URLs in text and turn them into clickable HTML links
function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" style="color: #ff5c8a; font-weight: bold; text-decoration: underline;">${url}</a>`;
    });
}

/**
 * Renders workouts/tasks coming from the SQLite database via Spring Boot
 */
async function renderCards() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json(); 

        // Calculate the total number of exercises and completed items
        const totalExercises = tasks.length;
        const completedExercises = tasks.filter(task => task.completed === true || task.completed === 1).length;

        const exerciseCounter = document.getElementById('exerciseCounter');
        if (exerciseCounter) {
            exerciseCounter.innerText = `Total Exercises: ${totalExercises} | Completed: ${completedExercises}`;
        }

        if (!cardContainer) return;
        cardContainer.innerHTML = ''; 

        tasks.forEach((task) => {
            const card = document.createElement('div');
            
            // Ensure the completion state is read correctly
            const isTaskCompleted = task.completed === true || task.completed === 1;
            
            card.className = `task-card ${isTaskCompleted ? 'completed' : ''}`;

            card.innerHTML = `
                <h3>${task.taskName}</h3>
                <p><strong>Workout Date:</strong> ${task.dueDate || 'No date set'}</p>
                <p><strong>Who will do it:</strong> ${task.assignee || 'Unassigned'}</p>
                <p><strong>Workout Creator:</strong> ${task.creator || 'No creator'}</p>
                <p><strong>Description / Link:</strong> ${urlify(task.description || 'No description provided')}</p>
                
                <div class="card-actions">
                    <button class="complete-btn" onclick="toggleComplete(${task.id}, ${isTaskCompleted})">
                        ${isTaskCompleted ? '⏹️ Undo' : '✅ Complete'}
                    </button>
                    <button class="delete-btn" onclick="removeTask(${task.id})">
                        ❌ Remove
                    </button>
                </div>
            `;
            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to render cards:", error);
    }
}

// Initial binding of the Add Button click event
if (addButton) {
    addButton.addEventListener('click', createExerciseCard);
}

// Automatically load existing records when the script loads
renderCards();

/**
 * Captures form inputs and sends them to the REST API via POST
 */
async function createExerciseCard() {
    const name = taskNameInput ? taskNameInput.value.trim() : '';
    const date = taskDateInput ? taskDateInput.value : '';
    const assignee = assigneeInput ? assigneeInput.value : '';
    const creator = creatorInput ? creatorInput.value : '';
    const desc = descriptionInput ? descriptionInput.value.trim() : '';

    // Basic required-field validation
    if (!name) {
        alert("Please enter or select an Exercise Name.");
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

    if (!desc) {
        alert("Please enter a description or link.");
        return;
    }

    const newTask = {
        taskName: name,
        dueDate: date,
        assignee: assignee,
        creator: creator,
        description: desc,
        completed: false
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
        console.error("Failed to create exercise task:", error);
    }
}

/**
 * Updates the completion status in the database
 */
async function toggleComplete(id, currentStatus) {
    const newStatus = !currentStatus;
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: newStatus })
        });
        renderCards();
    } catch (error) {
        console.error("Failed to toggle task status:", error);
    }
}

/**
 * Removes the exercise from the database with confirmation
 */
async function removeTask(id) {
    const userConfirmed = confirm("Do you really want to remove this exercise from your routine?");

    if (userConfirmed) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                renderCards(); 
            } else {
                alert("Error deleting the exercise.");
            }
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    }
}

/**
 * Clears form field elements and returns select selectors back to placeholder options
 */
function clearInputs() {
    if (taskNameInput) taskNameInput.value = '';
    if (taskDateInput) taskDateInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (assigneeInput) assigneeInput.value = '';
    if (creatorInput) creatorInput.value = '';
}

/**
 * Allows adding custom options dynamically to dropdown menus using modal prompt flows
 */
function checkEditable(selectElement) {
    if (selectElement.value === "CUSTOM_OPTION") {
        // Automatically determine field identity to serve customized prompts
        const fieldName = selectElement.id === "assignee" ? "assignee name" : "creator name/routine";
        
        // Open native dialogue entry box
        const customText = prompt(`Enter your custom ${fieldName}:`);
        
        if (customText && customText.trim() !== "") {
            const cleanText = customText.trim();
            
            // Build brand new option tag structure
            const newOption = document.createElement("option");
            newOption.value = cleanText;
            newOption.text = cleanText;
            newOption.selected = true;
            
            // Drop newly configured option directly above the custom field trigger line
            selectElement.add(newOption, selectElement.options[selectElement.options.length - 1]);
        } else {
            // Revert back to unchosen empty state if interaction cancelled
            selectElement.value = "";
        }
    }
}

// Global variable binding to preserve scope visibility for inline HTML attributes
window.checkEditable = checkEditable;

// =========================================================================
// --- INTERACTIVE VIDEO PREVIEW LOGIC IN MODAL (BOOTSTRAP 5) ---
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const videoModalElement = document.getElementById('videoPreviewModal');
    const videoFrame = document.getElementById('videoPlayerFrame');
    const videoModalLabel = document.getElementById('videoModalLabel');
    
    // Check if the modal element exists on the current page before initializing
    if (videoModalElement) {
        // Initialize the Bootstrap modal programmatically
        const bootstrapModal = new bootstrap.Modal(videoModalElement);

        // Listen for clicks on exercise links with the defined class
        document.querySelectorAll('.video-preview-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent page navigation or jumping to the top
                
                const videoId = trigger.getAttribute('data-video');
                const videoTitle = trigger.getAttribute('data-title');
                
                // Set the corresponding title in the modal dynamically
                if (videoModalLabel && videoTitle) {
                    videoModalLabel.textContent = `Preview: ${videoTitle}`;
                }
                
                // Build the YouTube embed URL with autoplay enabled
                if (videoFrame && videoId) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    bootstrapModal.show(); // Open the preview modal
                }
            });
        });

        // Event fired when the modal has finished closing completely
        videoModalElement.addEventListener('hidden.bs.modal', () => {
            if (videoFrame) {
                videoFrame.src = ""; // Reset the src to stop streaming and audio immediately
            }
        });
    }
});
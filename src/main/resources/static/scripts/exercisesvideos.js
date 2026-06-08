// Global DOM element references
const taskNameInput = document.getElementById('taskName');
const taskDateInput = document.getElementById('taskDate'); 
const assigneeInput = document.getElementById('assignee');
const creatorInput = document.getElementById('creator');
const descriptionInput = document.getElementById('description');
const addButton = document.getElementById('addButton');
const cardContainer = document.getElementById('cardContainer');

const videoModalElement = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoPlayerFrame');
const videoModalLabel = document.getElementById('videoModalLabel');
const closeModalBtn = document.getElementById('closeModalBtn');


function urlify(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" style="color: #5c5fff; font-weight: bold; text-decoration: underline;">${url}</a>`;
    });
}

// Render exercises from Spring Boot API
async function renderCards() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json(); 

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
            card.className = `task-card ${task.completed ? 'completed' : ''}`;

            card.innerHTML = `
                <h3>${task.taskName || 'Untitled Exercise'}</h3>
                <p><span class="label">Due Date:</span> ${task.dueDate || 'N/A'}</p>
                <p><span class="label">Assignee:</span> ${task.assignee || 'None'}</p>
                <p><span class="label">Created by:</span> ${task.creator || 'None'}</p>
                <p><span class="label">Notes / Link:</span> ${urlify(task.description || '')}</p>
                
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
        console.error("Error rendering exercise cards:", error);
    }
}

// Setup listeners after DOM content loads
document.addEventListener('DOMContentLoaded', () => {
    renderCards();

    // HTML5 native modal manager for videos
    if (videoModalElement) {
        document.querySelectorAll('.video-preview-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                const videoId = trigger.getAttribute('data-video');
                const videoTitle = trigger.getAttribute('data-title');
                
                if (videoModalLabel && videoTitle) {
                    videoModalLabel.textContent = `Preview: ${videoTitle}`;
                }
                
                if (videoFrame && videoId) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    videoModalElement.showModal();
                }
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                videoModalElement.close();
            });
        }

        // Reset frame when closing to stop YouTube audio
        videoModalElement.addEventListener('close', () => {
            if (videoFrame) {
                videoFrame.src = "";
            }
        });
    }

    // Form submission listener attached to native button
    if (addButton) {
        addButton.addEventListener('click', async () => {
            const taskName = taskNameInput ? taskNameInput.value : '';
            const dueDate = taskDateInput ? taskDateInput.value : '';
            const assignee = assigneeInput ? assigneeInput.value : '';
            const creator = creatorInput ? creatorInput.value : '';
            const description = descriptionInput ? descriptionInput.value : '';

            if (!taskName || taskName.trim() === "") {
                alert("⚠️ Please select or type an exercise!");
                return;
            }

            const newTask = {
                taskName: taskName,
                dueDate: dueDate ? dueDate : null,
                assignee: assignee ? assignee : null,
                creator: creator ? creator : null,
                description: description ? description : null,
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
                    
                    // Reset all form fields
                    if (taskNameInput) taskNameInput.value = '';
                    if (taskDateInput) taskDateInput.value = '';
                    if (assigneeInput) assigneeInput.value = '';
                    if (creatorInput) creatorInput.value = '';
                    if (descriptionInput) descriptionInput.value = '';
                    
                    renderCards();
                } else {
                    const errTxt = await response.text();
                    alert(`❌ Failed to save card: ${errTxt}`);
                }
            } catch (error) {
                console.error("Error creating custom routing exercise:", error);
                alert("❌ Connection network error or server is down!");
            }
        });
    }
});

// Functions exposed globally for dynamic click listeners
async function toggleComplete(id, currentStatus) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });
        if (response.ok) {
            renderCards();
        }
    } catch (error) {
        console.error("Error updating task status:", error);
    }
}

async function deleteCard(id) {
    if (!confirm("Are you sure you want to delete this exercise?")) return;
    try {
        const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (response.ok) {
            renderCards();
        }
    } catch (error) {
        console.error("Error removing card:", error);
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
window.toggleComplete = toggleComplete;
window.deleteCard = deleteCard;
window.checkEditable = checkEditable;
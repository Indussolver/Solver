// Smooth page transitions
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe elements
document.querySelectorAll('.feature-card, .task-item, .achievement-card, .reward-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scroll = window.scrollY;
    
    navbar.style.backdropFilter = scroll > 50 ? 'blur(25px)' : 'blur(20px)';
    navbar.style.background = scroll > 50 
        ? 'rgba(255, 255, 255, 0.98)' 
        : 'rgba(255, 255, 255, 0.96)';
});

// Feature card hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-16px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Task input focus effect
const taskInput = document.querySelector('.task-input-field');
if (taskInput) {
    taskInput.addEventListener('focus', () => {
        taskInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    taskInput.addEventListener('blur', () => {
        taskInput.parentElement.style.transform = 'scale(1)';
    });
}

// Phone floating animation
const phoneFrame = document.querySelector('.phone-frame');
if (phoneFrame) {
    phoneFrame.style.animation = 'float 6s ease-in-out infinite';
}
// === TASK PAGE FUNCTIONALITY (ADD ONLY) ===
if (document.querySelector('.task-main')) {
    class TaskManager {
        constructor() {
            this.tasks = JSON.parse(localStorage.getItem('solverTasks')) || [];
            this.init();
        }

        init() {
            this.bindEvents();
            this.renderTasks();
            this.updateStats();
        }

        bindEvents() {
            // Add task from search
            document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                    this.addTask(e.target.value.trim());
                    e.target.value = '';
                }
            });

            // Recommended tasks
            document.querySelectorAll('.rec-task-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.addTask(btn.dataset.task);
                });
            });

            // Floating button
            document.getElementById('addTaskBtn').addEventListener('click', () => {
                document.getElementById('newTaskInput').focus();
            });

            // Task checkboxes
            document.getElementById('taskList').addEventListener('click', (e) => {
                if (e.target.closest('.task-checkbox')) {
                    const taskItem = e.target.closest('.task-item');
                    const taskId = taskItem.dataset.id;
                    this.toggleTask(taskId);
                }
            });
        }

        addTask(text) {
            const task = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }

        toggleTask(id) {
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                
                if (task.completed) {
                    this.celebrate();
                }
            }
        }

        renderTasks() {
            const container = document.getElementById('taskList');
            container.innerHTML = '';
            
            this.tasks.forEach(task => {
                const taskEl = document.createElement('div');
                taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskEl.dataset.id = task.id;
                taskEl.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                    <div class="task-text">${task.text}</div>
                `;
                container.appendChild(taskEl);
            });
        }

        updateStats() {
            const pending = this.tasks.filter(t => !t.completed).length;
            const completed = this.tasks.filter(t => t.completed).length;
            document.getElementById('pendingTasks').textContent = pending;
            document.getElementById('doneTasks').textContent = completed;
        }

        saveTasks() {
            localStorage.setItem('solverTasks', JSON.stringify(this.tasks));
        }

        celebrate() {
            // Simple celebration - scale animation
            const btn = document.querySelector('.task-add-btn');
            btn.style.transform = 'scale(1.3) rotate(180deg)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 300);
        }
    }

    // Initialize task manager
    new TaskManager();
}

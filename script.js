class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('solver-tasks')) || [];
        this.canvas = document.getElementById('celebrationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.resizeCanvas();
    }

    bindEvents() {
        // Search input
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask(e.target.value);
                e.target.value = '';
            }
        });

        // Recommended cards
        document.querySelectorAll('.recommend-card').forEach(card => {
            card.addEventListener('click', () => {
                const taskText = card.dataset.task;
                this.addTask(taskText);
                this.showCelebration();
            });
        });

        // Add button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const input = document.getElementById('taskInput');
            input.focus();
            input.placeholder = 'Type your task and press Enter...';
        });

        // Task toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-checkbox')) {
                const taskCard = e.target.closest('.task-card');
                const taskId = taskCard.dataset.id;
                this.toggleTask(taskId);
            }
        });

        // Resize canvas
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    addTask(text) {
        if (!text.trim()) return;

        const task = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false,
            addedAt: new Date().toISOString()
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
                this.showCelebration();
            }
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        container.innerHTML = '';

        this.tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.id = task.id;

            taskCard.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                <div class="task-text">${task.text}</div>
            `;

            container.appendChild(taskCard);
        });
    }

    updateStats() {
        const pending = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;
        
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
    }

    saveTasks() {
        localStorage.setItem('solver-tasks', JSON.stringify(this.tasks));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    showCelebration() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create confetti particles
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 10,
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 15 - 5,
                size: Math.random() * 6 + 3,
                color: ['#667eea', '#764ba2', '#f093fb', '#f5576c'][Math.floor(Math.random() * 4)]
            });
        }

        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // gravity
                p.vx *= 0.99;

                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            if (particles.some(p => p.y < this.canvas.height)) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});

// Smooth scrolling and fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

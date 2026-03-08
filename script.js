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
// === ACHIEVEMENTS & ACCOUNT FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    // Achievements Stats Animation
    if (document.querySelector('.achievements-dashboard')) {
        const stats = [
            { selector: '[data-metric="tasks"] .stat-number', value: 127 },
            { selector: '[data-metric="completion"] .stat-number', value: 89 },
            { selector: '[data-metric="streak"] .stat-number', value: 12 }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                const animateNumber = () => {
                    let current = 0;
                    const increment = stat.value / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= stat.value) {
                            current = stat.value;
                            clearInterval(timer);
                        }
                        element.textContent = Math.floor(current) + (stat.selector.includes('completion') ? '%' : '');
                    }, 30);
                };
                setTimeout(animateNumber, 500);
            }
        });

        // Streak Progress Ring
        const progressFill = document.querySelector('.progress-ring-fill');
        const progressNumber = document.querySelector('.progress-number');
        if (progressFill && progressNumber) {
            const progress = 12 / 30; // 12/30 days
            const circumference = 377;
            const offset = circumference * (1 - progress);
            progressFill.style.strokeDashoffset = offset;
            progressNumber.textContent = '12';
        }
    }

    // Account Profile Upload
    if (document.querySelector('.account-dashboard')) {
        const fileInput = document.getElementById('profileUpload');
        const profileImg = document.getElementById('profileImg');
        const editBtn = document.querySelector('.edit-avatar-btn');

        const loadImage = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        editBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                loadImage(e.target.files[0]);
            }
        });

        // Username Save
        document.querySelector('.save-profile-btn').addEventListener('click', () => {
            const username = document.getElementById('usernameInput').value;
            localStorage.setItem('solver-username', username);
            // Add save animation
            const btn = event.target;
            btn.textContent = 'Saved!';
            setTimeout(() => btn.textContent = 'Save Profile', 2000);
        });

        // Load saved username
        const savedUsername = localStorage.getItem('solver-username');
        if (savedUsername) {
            document.getElementById('usernameInput').value = savedUsername;
        }

        // Toggle switches
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });
    }
});
// === TASK SECTION ANIMATIONS ===
if (document.querySelector('.task-feature-section')) {
    // Stagger step animations
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        const delay = card.dataset.delay || 0;
        setTimeout(() => {
            card.style.animation = `fadeInUpAnim 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards`;
        }, index * 200);
    });

    // CTA hover sound effect (subtle)
    const ctaBtn = document.querySelector('.cta-button');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            ctaBtn.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        ctaBtn.addEventListener('mouseleave', () => {
            ctaBtn.style.transform = '';
        });
    }

    // Step card hover interactions
    document.querySelectorAll('.step-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-16px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}
// === ACHIEVEMENTS SECTION ANIMATIONS ===
if (document.querySelector('.achievements-preview-section')) {
    // Achievement counters
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    achievementNumbers.forEach(number => {
        const target = parseInt(number.dataset.target);
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current);
        }, 25);
    });

    // Progress bars animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.progress-bar').forEach(bar => {
                    bar.style.setProperty('--fill', bar.style.getPropertyValue('--fill'));
                });
                observer.unobserve(entry.target);
            }
        });
    });

    const progressSection = document.querySelector('.progress-preview');
    if (progressSection) observer.observe(progressSection);

    // Staggered fade-in
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay * 1000;
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUpAnim 0.8s cubic-bezier(0.4,0,0.2,1) forwards';
                }, delay * 1000);
            }
        });
    });

    fadeElements.forEach(el => observer2.observe(el));
}

// Global variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let profile = JSON.parse(localStorage.getItem('profile')) || { name: '', email: '' };
let totalTasksCompleted = parseInt(localStorage.getItem('totalTasksCompleted')) || 0;

// DOM elements
const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const tasksList = document.getElementById('tasksList');
const newTaskInput = document.getElementById('newTask');
const addTaskBtn = document.getElementById('addTask');
const notesGrid = document.getElementById('notesGrid');
const newNoteTitle = document.getElementById('newNoteTitle');
const newNoteContent = document.getElementById('newNoteContent');
const addNoteBtn = document.getElementById('addNote');
const achievementsGrid = document.getElementById('achievementsGrid');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const saveProfileBtn = document.getElementById('saveProfile');
const avatarInitials = document.getElementById('avatarInitials');
const taskStats = document.querySelector('.task-stats');

// Initialize page based on current URL
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Initialize dropdown menu
    initMenu();
    
    // Page-specific initialization
    if (currentPage.includes('task')) {
        initTasks();
        updateTaskStats();
    } else if (currentPage.includes('notes')) {
        initNotes();
    } else if (currentPage.includes('achievement')) {
        updateAchievements();
    } else if (currentPage.includes('accounts')) {
        initProfile();
    }
    
    // Page transition effect
    setTimeout(() => {
        document.body.classList.remove('page-transition');
    }, 100);
});

// Menu functionality
function initMenu() {
    menuToggle.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
        dropdownMenu.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('show');
        }
    });
}

// TASKS FUNCTIONALITY
function initTasks() {
    renderTasks();
    
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
}

function addTask() {
    const text = newTaskInput.value.trim();
    if (!text) return;
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    newTaskInput.value = '';
    newTaskInput.focus();
    
    // Animate new task
    const newTaskEl = tasksList.querySelector('.task-item:last-child');
    newTaskEl.style.opacity = '0';
    newTaskEl.style.transform = 'translateY(20px)';
    setTimeout(() => {
        newTaskEl.style.transition = 'all 0.3s ease';
        newTaskEl.style.opacity = '1';
        newTaskEl.style.transform = 'translateY(0)';
    }, 10);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            totalTasksCompleted++;
            localStorage.setItem('totalTasksCompleted', totalTasksCompleted);
        }
        saveTasks();
        renderTasks();
        updateTaskStats();
        updateAchievements();
    }
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateTaskStats();
    }
}

function renderTasks() {
    if (!tasksList) return;
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        </div>
    `).join('');
}

function updateTaskStats() {
    if (!taskStats) return;
    
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    taskStats.innerHTML = `
        <span class="stat">${pending} pending</span>
        <span class="stat completed">${completed} completed</span>
    `;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// NOTES FUNCTIONALITY
// NOTES SYSTEM - COMPLETE FUNCTIONALITY
// Replace all existing notes code with this

class SolverNotes {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentNoteId = null;
        this.checklistItems = [];
        this.reminderTime = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderNotes();
        this.requestNotificationPermission();
    }

    bindEvents() {
        // FAB
        document.getElementById('newNoteBtn').addEventListener('click', () => this.openEditor());
        
        // Editor
        document.getElementById('saveBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('cancelBtn').addEventListener('click', () => this.showCancelConfirm());
        document.getElementById('addChecklistBtn').addEventListener('click', () => this.addChecklistItem());
        document.getElementById('reminderBtn').addEventListener('click', () => this.toggleReminder());
        
        // Confirmations
        document.getElementById('continueBtn').addEventListener('click', () => this.hideCancelConfirm());
        document.getElementById('confirmCancelBtn').addEventListener('click', () => this.cancelNote());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideDeleteConfirm());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.deleteNote());
        
        // Keyboard
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    openEditor(noteId = null) {
        this.currentNoteId = noteId;
        this.checklistItems = [];
        this.reminderTime = null;
        
        if (noteId) {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                document.getElementById('noteTitle').value = note.title;
                document.getElementById('noteContent').value = note.content;
                this.checklistItems = note.checklist || [];
                this.reminderTime = note.reminder;
            }
        } else {
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
        }
        
        this.renderChecklist();
        this.updateReminderUI();
        this.showModal('noteModal');
    }

    saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        
        if (!title && !content && this.checklistItems.length === 0) return;
        
        const note = {
            id: this.currentNoteId || Date.now(),
            title: title || 'Untitled',
            content: content,
            checklist: this.checklistItems.filter(item => item.text.trim()),
            reminder: this.reminderTime,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentNoteId) {
            const index = this.notes.findIndex(n => n.id === this.currentNoteId);
            this.notes[index] = note;
        } else {
            this.notes.unshift(note);
        }
        
        this.saveToStorage();
        this.renderNotes();
        this.hideModal('noteModal');
        
        // Schedule reminder if set
        if (this.reminderTime) {
            this.scheduleReminder(note);
        }
    }

    addChecklistItem() {
        const item = { id: Date.now(), text: '', checked: false };
        this.checklistItems.push(item);
        this.renderChecklist();
    }

    deleteChecklistItem(id) {
        this.checklistItems = this.checklistItems.filter(item => item.id !== id);
        this.renderChecklist();
    }

    toggleChecklistItem(id) {
        const item = this.checklistItems.find(item => item.id === id);
        if (item) item.checked = !item.checked;
        this.renderChecklist();
    }

    renderChecklist() {
        const container = document.getElementById('checklistItems');
        container.innerHTML = this.checklistItems.map(item => `
            <div class="checklist-item">
                <input type="checkbox" class="checklist-checkbox" 
                       ${item.checked ? 'checked' : ''} 
                       onchange="notes.toggleChecklistItem(${item.id})">
                <input type="text" class="checklist-input" 
                       value="${item.text}" 
                       placeholder="Checklist item..."
                       oninput="notes.updateChecklistItem(${item.id}, this.value)">
                <button class="checklist-delete" onclick="notes.deleteChecklistItem(${item.id})">×</button>
            </div>
        `).join('');
    }

    updateChecklistItem(id, text) {
        const item = this.checklistItems.find(item => item.id === id);
        if (item) item.text = text;
    }

    toggleReminder() {
        const input = document.getElementById('reminderInput');
        const btn = document.getElementById('reminderBtn');
        input.classList.toggle('hidden');
        if (!input.classList.contains('hidden')) {
            input.focus();
        }
    }

    updateReminderUI() {
        const input = document.getElementById('reminderInput');
        const btn = document.getElementById('reminderBtn');
        
        if (this.reminderTime) {
            input.value = this.reminderTime;
        } else {
            input.value = '';
        }
        
        input.onchange = (e) => {
            this.reminderTime = e.target.value;
        };
    }

    showCancelConfirm() {
        this.hideModal('noteModal');
        this.showModal('cancelModal');
    }

    hideCancelConfirm() {
        this.hideModal('cancelModal');
        this.showModal('noteModal');
    }

    cancelNote() {
        this.hideModal('cancelModal');
        this.hideModal('noteModal');
    }

    showDeleteConfirm(noteId) {
        this.currentNoteId = noteId;
        this.showModal('deleteModal');
    }

    deleteNote() {
        this.notes = this.notes.filter(note => note.id !== this.currentNoteId);
        this.saveToStorage();
        this.renderNotes();
        this.hideModal('deleteModal');
    }

    renderNotes() {
        const grid = document.getElementById('notesGrid');
        if (this.notes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>Click + to create your first note</p>
                </div>
            `;
        } else {
            grid.innerHTML = this.notes.map(note => `
                <div class="note-card" onclick="notes.openEditor(${note.id})">
                    <button class="note-delete" onclick="notes.showDeleteConfirm(${note.id}); event.stopPropagation()">×</button>
                    <h3>${this.escapeHtml(note.title)}</h3>
                    <p>${this.escapeHtml(note.content || 'No content')}${note.checklist && note.checklist.length ? `<br><small>• ${note.checklist.length} checklist items</small>` : ''}</p>
                </div>
            `).join('');
        }
    }

    showModal(id) {
        document.getElementById(id).classList.remove('hidden');
        setTimeout(() => document.getElementById(id).classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    }

    hideModal(id) {
        const modal = document.getElementById(id);
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    saveToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    scheduleReminder(note) {
        if (!note.reminder || !('Notification' in window)) return;
        
        const reminderTime = new Date(note.reminder).getTime();
        const now = Date.now();
        
        const timeUntil = reminderTime - now;
        if (timeUntil > 0) {
            setTimeout(() => {
                if (Notification.permission === 'granted') {
                    new Notification('Reminder from Solver Notes', {
                        body: `${note.title}\n${note.content.substring(0, 100)}...`,
                        icon: '/favicon.ico'
                    });
                }
            }, timeUntil);
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('noteModal').classList.contains('show')) {
                this.showCancelConfirm();
            }
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            this.saveNote();
        }
    }
}

// Initialize when DOM loads
if (window.location.pathname.includes('notes.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.notes = new SolverNotes();
        
        // Menu functionality (keep existing)
        const menuToggle = document.querySelector('.menu-toggle');
        const dropdown = document.querySelector('.dropdown-menu');
        
        menuToggle.addEventListener('click', () => {
            dropdown.classList.toggle('show');
            dropdown.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
                dropdown.classList.remove('show');
            }
        });
    });
}


// ACHIEVEMENTS FUNCTIONALITY
function updateAchievements() {
    if (!achievementsGrid) return;
    
    const achievements = [
        { id: 1, title: 'Task Starter', desc: 'Complete 10 tasks', target: 10 },
        { id: 2, title: 'Productivity Pro', desc: 'Complete 50 tasks', target: 50 },
        { id: 3, title: 'Master Solver', desc: 'Complete 100 tasks', target: 100 }
    ];
    
    achievementsGrid.innerHTML = achievements.map(ach => {
        const unlocked = totalTasksCompleted >= ach.target;
        const progress = Math.min((totalTasksCompleted / ach.target) * 100, 100);
        
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${getAchievementIcon(ach.id)}</div>
                <h3>${ach.title}</h3>
                <p>${ach.desc}</p>
                <div class="achievement-progress">
                    <div class="progress-bar ${unlocked ? '' : 'locked'}" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function getAchievementIcon(id) {
    const icons = ['🎯', '🚀', '🏆'];
    return icons[id - 1];
}

// PROFILE FUNCTIONALITY
function initProfile() {
    userNameInput.value = profile.name;
    userEmailInput.value = profile.email;
    updateAvatar();
    
    saveProfileBtn.addEventListener('click', saveProfile);
}

function saveProfile() {
    profile.name = userNameInput.value.trim();
    profile.email = userEmailInput.value.trim();
    
    localStorage.setItem('profile', JSON.stringify(profile));
    updateAvatar();
    
    // Visual feedback
    saveProfileBtn.textContent = 'Saved!';
    saveProfileBtn.style.background = '#10b981';
    setTimeout(() => {
        saveProfileBtn.textContent = 'Save Profile';
        saveProfileBtn.style.background = '';
    }, 2000);
}

function updateAvatar() {
    if (profile.name) {
        const initials = profile.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        avatarInitials.textContent = initials;
    } else {
        avatarInitials.textContent = 'UI';
    }
}

// Close dropdown on route change
window.addEventListener('popstate', () => {
    dropdownMenu.classList.add('hidden');
    dropdownMenu.classList.remove('show');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        dropdownMenu.classList.add('hidden');
        dropdownMenu.classList.remove('show');
    });
});

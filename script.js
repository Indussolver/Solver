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
// COMPLETE NOTES SYSTEM - FIXED & PREMIUM
// Replace ALL existing notes code with this

class SolverNotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.editingNoteId = null;
        this.checklistItems = [];
        this.reminderTimeouts = new Map();
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderNotes();
        this.requestNotificationPermission();
    }

    cacheElements() {
        this.notesListView = document.getElementById('notesListView');
        this.editorView = document.getElementById('editorView');
        this.notesGrid = document.getElementById('notesGrid');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.editorSaveBtn = document.getElementById('editorSaveBtn');
        this.editorCancelBtn = document.getElementById('editorCancelBtn');
        this.editorTitle = document.getElementById('editorTitle');
        this.editorContent = document.getElementById('editorContent');
        this.addChecklistItem = document.getElementById('addChecklistItem');
        this.reminderToggle = document.getElementById('reminderToggle');
        this.reminderPicker = document.getElementById('reminderPicker');
        this.reminderDate = document.getElementById('reminderDate');
        this.reminderTime = document.getElementById('reminderTime');
        this.saveReminder = document.getElementById('saveReminder');
        this.deleteConfirm = document.getElementById('deleteConfirm');
        this.cancelDelete = document.getElementById('cancelDelete');
        this.confirmDelete = document.getElementById('confirmDelete');
        this.checklistContainer = document.getElementById('checklistContainer');
    }

    bindEvents() {
        // Navigation
        this.newNoteBtn.onclick = () => this.openEditor();
        this.editorSaveBtn.onclick = () => this.saveNote();
        this.editorCancelBtn.onclick = () => this.cancelEdit();
        this.addChecklistItem.onclick = () => this.addChecklistItemFn();
        this.reminderToggle.onclick = () => this.toggleReminderPicker();
        this.saveReminder.onclick = () => this.setReminder();
        this.cancelDelete.onclick = () => this.hideDeleteConfirm();
        this.confirmDelete.onclick = () => this.deleteNoteConfirm();

        // Global events
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    openEditor(noteId = null) {
        this.editingNoteId = noteId;
        this.checklistItems = [];
        
        if (noteId) {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                this.editorTitle.value = note.title;
                this.editorContent.value = note.content;
                this.checklistItems = note.checklist || [];
            }
        } else {
            this.editorTitle.value = '';
            this.editorContent.value = '';
        }
        
        this.renderChecklist();
        this.notesListView.classList.remove('active');
        this.editorView.classList.add('show');
    }

    cancelEdit() {
        this.closeEditor();
    }

    saveNote() {
        const title = this.editorTitle.value.trim();
        const content = this.editorContent.value.trim();
        const checklist = this.checklistItems.filter(item => item.text.trim()).map(item => ({
            ...item,
            text: item.text.trim()
        }));

        const note = {
            id: this.editingNoteId || Date.now(),
            title: title || 'Untitled',
            content,
            checklist,
            createdAt: this.editingNoteId ? this.notes.find(n => n.id === this.editingNoteId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingNoteId) {
            const index = this.notes.findIndex(n => n.id === this.editingNoteId);
            this.notes[index] = note;
        } else {
            this.notes.unshift(note);
        }

        this.saveNotes();
        this.renderNotes();
        this.closeEditor();
    }

    closeEditor() {
        this.editorView.classList.remove('show');
        setTimeout(() => {
            this.notesListView.classList.add('active');
            this.editingNoteId = null;
            this.checklistItems = [];
        }, 400);
    }

    addChecklistItemFn() {
        this.checklistItems.push({
            id: Date.now(),
            text: '',
            checked: false
        });
        this.renderChecklist();
    }

    renderChecklist() {
        this.checklistContainer.innerHTML = `
            <div class="checklist-header">
                <span>Checklist</span>
                <button class="btn-add-checklist" id="addChecklistItem">+</button>
            </div>
            <div class="checklist-items">
                ${this.checklistItems.map(item => `
                    <div class="checklist-item" data-id="${item.id}">
                        <input type="checkbox" class="checklist-checkbox" 
                               ${item.checked ? 'checked' : ''}>
                        <input type="text" class="checklist-input" 
                               value="${item.text}" 
                               placeholder="Checklist item">
                        <button class="checklist-delete">×</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Rebind checklist events
        this.checklistContainer.querySelectorAll('.checklist-checkbox').forEach((cb, index) => {
            cb.onclick = () => {
                this.checklistItems[index].checked = cb.checked;
            };
        });

        this.checklistContainer.querySelectorAll('.checklist-input').forEach((input, index) => {
            input.oninput = (e) => {
                this.checklistItems[index].text = e.target.value;
            };
        });

        this.checklistContainer.querySelectorAll('.checklist-delete').forEach((btn, index) => {
            btn.onclick = () => {
                this.checklistItems.splice(index, 1);
                this.renderChecklist();
            };
        });

        // Rebind add button
        document.getElementById('addChecklistItem').onclick = () => this.addChecklistItemFn();
    }

    toggleReminderPicker() {
        this.reminderPicker.classList.toggle('hidden');
    }

    setReminder() {
        const date = this.reminderDate.value;
        const time = this.reminderTime.value;
        if (date && time) {
            const reminderTime = `${date}T${time}`;
            console.log('Reminder set for:', reminderTime);
            // Schedule notification
            const now = new Date().getTime();
            const reminderDate = new Date(reminderTime).getTime();
            const delay = reminderDate - now;
            
            if (delay > 0) {
                setTimeout(() => {
                    if (Notification.permission === 'granted') {
                        new Notification('Reminder from Solver Notes', {
                            body: this.editorTitle.value || 'Note reminder',
                            icon: 'data:image/svg+xml;base64,...' // Add icon
                        });
                    }
                }, delay);
            }
        }
    }

    renderNotes() {
        if (this.notes.length === 0) {
            this.notesGrid.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 64px; opacity: 0.3; margin-bottom: 24px;">📝</div>
                    <h3 style="font-size: 24px; color: #6b7280; margin-bottom: 8px;">No notes yet</h3>
                    <p style="color: #9ca3af;">Click + to create your first note</p>
                </div>
            `;
        } else {
            this.notesGrid.innerHTML = this.notes.map(note => `
                <div class="note-card" data-note-id="${note.id}">
                    <div class="card-actions">
                        <button class="btn-icon edit-btn" title="Edit">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="btn-icon delete-btn" title="Delete">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    <h3>${this.escapeHtml(note.title)}</h3>
                    <p>${this.escapeHtml(note.content || 'No content')}</p>
                </div>
            `).join('');
        }

        // Bind card events
        this.notesGrid.querySelectorAll('.note-card').forEach(card => {
            card.onclick = (e) => {
                if (!e.target.closest('.card-actions')) {
                    const noteId = card.dataset.noteId;
                    this.openEditor(parseInt(noteId));
                }
            };
        });

        this.notesGrid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const noteId = btn.closest('.note-card').dataset.noteId;
                this.openEditor(parseInt(noteId));
            };
        });

        this.notesGrid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const noteId = btn.closest('.note-card').dataset.noteId;
                this.showDeleteConfirm(parseInt(noteId));
            };
        });
    }

    showDeleteConfirm(noteId) {
        this.editingNoteId = noteId;
        this.deleteConfirm.classList.remove('hidden');
        setTimeout(() => this.deleteConfirm.classList.add('show'), 10);
    }

    hideDeleteConfirm() {
        this.deleteConfirm.classList.remove('show');
        setTimeout(() => {
            this.deleteConfirm.classList.add('hidden');
            this.editingNoteId = null;
        }, 200);
    }

    deleteNoteConfirm() {
        this.notes = this.notes.filter(note => note.id !== this.editingNoteId);
        this.saveNotes();
        this.renderNotes();
        this.hideDeleteConfirm();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    handleGlobalClick(e) {
        // Menu dropdown logic (keep existing)
        const menuToggle = document.querySelector('.menu-toggle');
        const dropdown = document.querySelector('.dropdown-menu');
        if (menuToggle && dropdown && !menuToggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            dropdown.classList.add('hidden');
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.editorView.classList.contains('show')) {
                this.cancelEdit();
            }
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            if (this.editorView.classList.contains('show')) {
                this.saveNote();
            }
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new SolverNotesApp();
    
    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdown = document.querySelector('.dropdown-menu');
    if (menuToggle && dropdown) {
        menuToggle.onclick = () => {
            dropdown.classList.toggle('show');
            dropdown.classList.toggle('hidden');
        };
    }
});


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

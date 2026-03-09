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
/**
 * Solver Notes - Premium Productivity App
 * Production-ready JavaScript for full Notes functionality
 * Notion/Linear style UI interactions
 */

class SolverNotes {
    constructor() {
        // State management
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.editingNoteId = null;
        this.checklistItems = [];
        this.hasUnsavedChanges = false;
        this.reminderTimeouts = new Map();
        
        // DOM cache
        this.elements = {};
        
        // Initialize
        this.init();
    }

    /**
     * Initialize app - bind events, render UI, request permissions
     */
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderNotes();
        this.requestNotificationPermission();
    }

    /**
     * Cache all DOM elements for performance
     */
    cacheDOM() {
        const selectors = {
            notesGrid: '#notesGrid',
            newNoteBtn: '#newNoteBtn',
            editorView: '#editorView',
            editorOverlay: '#editorOverlay',
            editorSaveBtn: '#editorSaveBtn',
            editorCancelBtn: '#editorCancelBtn',
            editorTitle: '#editorTitle',
            editorContent: '#editorContent',
            addChecklistItem: '#addChecklistItem',
            reminderToggle: '#reminderToggle',
            reminderPicker: '#reminderPicker',
            reminderDate: '#reminderDate',
            reminderTime: '#reminderTime',
            saveReminder: '#saveReminder',
            deleteConfirm: '#deleteConfirm',
            cancelDelete: '#cancelDelete',
            confirmDelete: '#confirmDelete',
            checklistContainer: '#checklistContainer',
            menuToggle: '.menu-toggle',
            dropdownMenu: '.dropdown-menu'
        };

        Object.entries(selectors).forEach(([key, selector]) => {
            this.elements[key] = document.querySelector(selector);
        });
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Main actions
        if (this.elements.newNoteBtn) this.elements.newNoteBtn.addEventListener('click', () => this.openEditor());
        if (this.elements.editorSaveBtn) this.elements.editorSaveBtn.addEventListener('click', () => this.saveNote());
        if (this.elements.editorCancelBtn) this.elements.editorCancelBtn.addEventListener('click', () => this.handleCancel());
        
        // Checklist
        if (this.elements.addChecklistItem) this.elements.addChecklistItem.addEventListener('click', () => this.addChecklistItem());
        
        // Reminder
        if (this.elements.reminderToggle) this.elements.reminderToggle.addEventListener('click', () => this.toggleReminder());
        if (this.elements.saveReminder) this.elements.saveReminder.addEventListener('click', () => this.setReminder());
        
        // Confirmations
        if (this.elements.cancelDelete) this.elements.cancelDelete.addEventListener('click', () => this.hideDeleteConfirm());
        if (this.elements.confirmDelete) this.elements.confirmDelete.addEventListener('click', () => this.deleteNoteConfirm());
        
        // Global listeners
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Menu functionality
        this.initMenu();
    }

    /**
     * Initialize 3-dot menu
     */
    initMenu() {
        const menuToggle = this.elements.menuToggle;
        const dropdown = this.elements.dropdownMenu;
        
        if (menuToggle && dropdown) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
                dropdown.classList.toggle('hidden');
            });
        }
    }

    /**
     * Open full-screen editor (new note or edit existing)
     */
    openEditor(noteId = null) {
        this.editingNoteId = noteId;
        this.checklistItems = [];
        this.hasUnsavedChanges = false;

        // Load existing note data
        if (noteId) {
            const note = this.notes.find(n => n.id === parseInt(noteId));
            if (note) {
                this.elements.editorTitle.value = note.title || '';
                this.elements.editorContent.value = note.content || '';
                this.checklistItems = note.checklist || [];
            }
        } else {
            this.elements.editorTitle.value = '';
            this.elements.editorContent.value = '';
        }

        // Update UI
        this.renderChecklist();
        this.elements.notesListView?.classList.remove('active');
        this.elements.editorView?.classList.add('show');
        
        // Focus title
        this.elements.editorTitle?.focus();
    }

    /**
     * Handle cancel button - check for unsaved changes
     */
    handleCancel() {
        if (this.hasUnsavedChanges) {
            this.showCancelConfirm();
        } else {
            this.closeEditor();
        }
    }

    /**
     * Show cancel confirmation dialog
     */
    showCancelConfirm() {
        // Implementation for cancel confirmation modal
        if (confirm('Are you sure you want to cancel writing this note? Unsaved changes will be lost.')) {
            this.closeEditor();
        }
    }

    /**
     * Close editor and return to notes list
     */
    closeEditor() {
        this.elements.editorView?.classList.remove('show');
        setTimeout(() => {
            this.elements.notesListView?.classList.add('active');
            this.editingNoteId = null;
            this.checklistItems = [];
        }, 400);
    }

    /**
     * Save current note
     */
    saveNote() {
        const title = this.elements.editorTitle.value.trim();
        const content = this.elements.editorContent.value.trim();
        
        // Filter valid checklist items
        const checklist = this.checklistItems
            .filter(item => item.text.trim())
            .map(item => ({
                id: item.id,
                text: item.text.trim(),
                checked: item.checked
            }));

        const note = {
            id: this.editingNoteId || Date.now(),
            title: title || 'Untitled',
            content: content,
            checklist: checklist,
            createdAt: this.editingNoteId ? 
                this.notes.find(n => n.id === this.editingNoteId)?.createdAt : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Update or add note
        if (this.editingNoteId) {
            const index = this.notes.findIndex(n => n.id === this.editingNoteId);
            this.notes[index] = note;
        } else {
            this.notes.unshift(note);
        }

        this.saveToStorage();
        this.renderNotes();
        this.closeEditor();
    }

    /**
     * Add new checklist item
     */
    addChecklistItem() {
        this.checklistItems.push({
            id: Date.now(),
            text: '',
            checked: false
        });
        this.renderChecklist();
    }

    /**
     * Render checklist items in editor
     */
    renderChecklist() {
        const container = this.elements.checklistContainer;
        if (!container) return;

        const itemsHtml = this.checklistItems.map((item, index) => `
            <div class="checklist-item" data-index="${index}">
                <input type="checkbox" class="checklist-checkbox" ${item.checked ? 'checked' : ''}>
                <input type="text" class="checklist-input" value="${this.escapeHtml(item.text)}" placeholder="Checklist item">
                <button class="checklist-delete" type="button">×</button>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="checklist-header">
                <span>Checklist</span>
                <button class="btn-add-checklist" id="addChecklistItem" type="button">+</button>
            </div>
            <div class="checklist-items">
                ${itemsHtml}
            </div>
        `;

        // Re-bind checklist events
        this.bindChecklistEvents();
    }

    /**
     * Bind events to checklist items after render
     */
    bindChecklistEvents() {
        const container = this.elements.checklistContainer;
        if (!container) return;

        // Checkbox toggle
        container.querySelectorAll('.checklist-checkbox').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                this.checklistItems[index].checked = checkbox.checked;
                this.hasUnsavedChanges = true;
            });
        });

        // Text input
        container.querySelectorAll('.checklist-input').forEach((input, index) => {
            input.addEventListener('input', (e) => {
                this.checklistItems[index].text = e.target.value;
                this.hasUnsavedChanges = true;
            });
        });

        // Delete item
        container.querySelectorAll('.checklist-delete').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.checklistItems.splice(index, 1);
                this.renderChecklist();
                this.hasUnsavedChanges = true;
            });
        });

        // Re-bind add button
        const addBtn = container.querySelector('#addChecklistItem');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addChecklistItem());
        }
    }

    /**
     * Toggle reminder picker visibility
     */
    toggleReminder() {
        this.elements.reminderPicker?.classList.toggle('hidden');
    }

    /**
     * Set reminder with notification
     */
    setReminder() {
        const date = this.elements.reminderDate?.value;
        const time = this.elements.reminderTime?.value;
        
        if (date && time) {
            const reminderTime = new Date(`${date}T${time}`).getTime();
            const now = Date.now();
            const delay = reminderTime - now;

            if (delay > 0) {
                // Clear existing timeout for this note
                if (this.reminderTimeouts.has(this.editingNoteId)) {
                    clearTimeout(this.reminderTimeouts.get(this.editingNoteId));
                }

                // Schedule new reminder
                const timeoutId = setTimeout(() => {
                    if (Notification.permission === 'granted') {
                        new Notification('Reminder from Solver Notes', {
                            body: this.elements.editorTitle.value || 'Note reminder',
                            icon: '/favicon.ico'
                        });
                    }
                }, delay);

                this.reminderTimeouts.set(this.editingNoteId, timeoutId);
            }
        }
        
        this.elements.reminderPicker?.classList.add('hidden');
    }

    /**
     * Render all notes in grid
     */
    renderNotes() {
        const grid = this.elements.notesGrid;
        if (!grid) return;

        if (this.notes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 80px 20px; color: #9ca3af;">
                    <div style="font-size: 64px; opacity: 0.4; margin-bottom: 24px;">📝</div>
                    <h3 style="font-size: 24px; margin-bottom: 8px; color: #6b7280;">No notes yet</h3>
                    <p>Click + to create your first note</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.notes.map(note => `
            <div class="note-card" data-note-id="${note.id}">
                <div class="card-actions">
                    <button class="btn-icon edit-btn" title="Edit note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </button>
                </div>
                <h3>${this.escapeHtml(note.title)}</h3>
                <p>${this.escapeHtml(note.content || 'No content')}</p>
                ${note.checklist && note.checklist.length ? `<div style="font-size: 13px; color: #6b7280; margin-top: 8px;">${note.checklist.length} checklist items</div>` : ''}
            </div>
        `).join('');

        // Bind card events after render
        this.bindNoteCardEvents();
    }

    /**
     * Bind events to note cards (edit/delete)
     */
    bindNoteCardEvents() {
        const grid = this.elements.notesGrid;
        if (!grid) return;

        grid.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.card-actions')) return;
                const noteId = parseInt(card.dataset.noteId);
                this.openEditor(noteId);
            });
        });

        grid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.note-card');
                const noteId = parseInt(card.dataset.noteId);
                this.openEditor(noteId);
            });
        });

        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.note-card');
                const noteId = parseInt(card.dataset.noteId);
                this.showDeleteConfirm(noteId);
            });
        });
    }

    /**
     * Show delete confirmation
     */
    showDeleteConfirm(noteId) {
        this.editingNoteId = noteId;
        this.elements.deleteConfirm?.classList.remove('hidden');
        setTimeout(() => {
            this.elements.deleteConfirm?.classList.add('show');
        }, 10);
    }

    /**
     * Hide delete confirmation
     */
    hideDeleteConfirm() {
        this.elements.deleteConfirm?.classList.remove('show');
        setTimeout(() => {
            this.elements.deleteConfirm?.classList.add('hidden');
            this.editingNoteId = null;
        }, 200);
    }

    /**
     * Confirm and delete note
     */
    deleteNoteConfirm() {
        if (!this.editingNoteId) return;
        
        this.notes = this.notes.filter(note => note.id !== this.editingNoteId);
        this.saveToStorage();
        this.renderNotes();
        this.hideDeleteConfirm();
    }

    /**
     * Save notes to localStorage
     */
    saveToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Request notification permission
     */
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    /**
     * Handle document clicks (close menus, modals)
     */
    handleDocumentClick(e) {
        const menuToggle = this.elements.menuToggle;
        const dropdown = this.elements.dropdownMenu;
        
        if (menuToggle && dropdown && !menuToggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            dropdown.classList.add('hidden');
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeydown(e) {
        // Escape - close editor
        if (e.key === 'Escape') {
            if (this.elements.editorView?.classList.contains('show')) {
                this.handleCancel();
            }
        }
        
        // Ctrl+Enter - save note
        if (e.key === 'Enter' && e.ctrlKey) {
            if (this.elements.editorView?.classList.contains('show')) {
                this.saveNote();
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu first (works on all pages)
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownMenu.classList.add('hidden');
            }
        });
    }
    
    // Initialize notes app only on notes page
    if (window.location.pathname.includes('notes.html')) {
        window.solverNotes = new SolverNotes();
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

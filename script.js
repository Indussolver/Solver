// Global variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let profile = JSON.parse(localStorage.getItem('profile')) || { name: '', email: '' };
let totalTasksCompleted = parseInt(localStorage.getItem('totalTasksCompleted')) || 0;

// DOM elements
const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const tasksList = document.getElementById('tasksList');
const newTaskInput = document.getElementById('newTask');
const addTaskBtn = document.getElementById('addTask');

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
// NOTES FUNCTIONALITY ONLY
// Add this to your existing script.js file, replacing any existing notes code

// Notes data
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteToDelete = null;
let noteTitleInput, noteContentInput, noteModal, cancelConfirmModal, deleteConfirmModal;

// DOM Elements (Notes specific)
const createNoteBtn = document.getElementById('createNoteBtn');
const noteModalEl = document.getElementById('noteModal');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelConfirmModalEl = document.getElementById('cancelConfirmModal');
const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
const continueWritingBtn = document.getElementById('continueWritingBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const notesGrid = document.getElementById('notesGrid');

// Initialize notes page
function initNotesPage() {
    // Get input elements
    noteTitleInput = document.getElementById('noteTitle');
    noteContentInput = document.getElementById('noteContent');
    noteModal = noteModalEl;
    cancelConfirmModal = cancelConfirmModalEl;
    deleteConfirmModal = deleteConfirmModalEl;
    
    // Render existing notes
    renderNotes();
    
    // Event listeners
    createNoteBtn.addEventListener('click', openNoteEditor);
    cancelNoteBtn.addEventListener('click', showCancelConfirm);
    saveNoteBtn.addEventListener('click', saveNote);
    continueWritingBtn.addEventListener('click', closeCancelConfirm);
    confirmCancelBtn.addEventListener('click', cancelNote);
    
    cancelDeleteBtn.addEventListener('click', closeDeleteConfirm);
    confirmDeleteBtn.addEventListener('click', deleteNote);
    
    // Close modals on escape key
    document.addEventListener('keydown', handleKeydown);
    
    // Close modals on outside click
    noteModal.addEventListener('click', (e) => {
        if (e.target === noteModal) showCancelConfirm();
    });
}

// Open note editor modal
function openNoteEditor() {
    noteTitleInput.value = '';
    noteContentInput.value = '';
    noteTitleInput.focus();
    noteModal.classList.remove('hidden');
    noteModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close note editor (with confirmation)
function showCancelConfirm() {
    noteModal.classList.remove('show');
    cancelConfirmModal.classList.remove('hidden');
    cancelConfirmModal.classList.add('show');
}

// Close cancel confirmation and return to editor
function closeCancelConfirm() {
    cancelConfirmModal.classList.remove('show');
    cancelConfirmModal.classList.add('hidden');
    noteModal.classList.add('show');
}

// Actually cancel and close editor
function cancelNote() {
    closeCancelConfirm();
    closeNoteModal();
}

// Save note
function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title && !content) {
        closeNoteModal();
        return;
    }
    
    const note = {
        id: Date.now(),
        title: title || 'Untitled',
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveNotes();
    renderNotes();
    closeNoteModal();
    
    // Success feedback
    createNoteBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        createNoteBtn.style.transform = '';
    }, 150);
}

// Delete note
function deleteNote() {
    if (currentNoteToDelete) {
        notes = notes.filter(note => note.id !== currentNoteToDelete);
        saveNotes();
        renderNotes();
        closeDeleteConfirm();
        currentNoteToDelete = null;
    }
}

// Show delete confirmation
function showDeleteConfirm(noteId) {
    currentNoteToDelete = noteId;
    deleteConfirmModal.classList.remove('hidden');
    deleteConfirmModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close delete confirmation
function closeDeleteConfirm() {
    deleteConfirmModal.classList.remove('show');
    deleteConfirmModal.classList.add('hidden');
    document.body.style.overflow = '';
    currentNoteToDelete = null;
}

// Close note modal
function closeNoteModal() {
    noteModal.classList.remove('show');
    noteModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Render notes grid
function renderNotes() {
    if (notesGrid) {
        if (notes.length === 0) {
            notesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>Click the + button to create your first note</p>
                </div>
            `;
        } else {
            notesGrid.innerHTML = notes.map(note => `
                <div class="note-card" data-id="${note.id}">
                    <button class="note-delete" onclick="showDeleteConfirm(${note.id})">×</button>
                    <h3>${escapeHtml(note.title)}</h3>
                    <p>${escapeHtml(note.content) || 'No content'}</p>
                </div>
            `).join('');
        }
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleKeydown(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        if (noteModal.classList.contains('show')) {
            showCancelConfirm();
        } else if (cancelConfirmModal.classList.contains('show')) {
            closeCancelConfirm();
        } else if (deleteConfirmModal.classList.contains('show')) {
            closeDeleteConfirm();
        }
    }
    
    // Enter + Shift saves note in editor
    if (e.key === 'Enter' && e.shiftKey && noteModal.classList.contains('show')) {
        e.preventDefault();
        saveNote();
    }
}

// Initialize notes page if on notes.html
if (window.location.pathname.includes('notes.html')) {
    document.addEventListener('DOMContentLoaded', initNotesPage);
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

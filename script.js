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
function initNotes() {
    renderNotes();
    
    addNoteBtn.addEventListener('click', addNote);
    newNoteTitle.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
        }
    });
}

function addNote() {
    const title = newNoteTitle.value.trim();
    const content = newNoteContent.value.trim();
    
    if (!title && !content) return;
    
    const note = {
        id: Date.now(),
        title: title || 'Untitled',
        content: content,
        createdAt: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveNotes();
    renderNotes();
    newNoteTitle.value = '';
    newNoteContent.value = '';
    newNoteTitle.focus();
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
    }
}

function renderNotes() {
    if (!notesGrid) return;
    
    notesGrid.innerHTML = notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <button class="note-delete" onclick="deleteNote(${note.id})">×</button>
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
        </div>
    `).join('');
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
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

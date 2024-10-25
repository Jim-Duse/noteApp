// GET ALL NEEDED ELEMENTS
let color = document.getElementById('color');
let createBtn = document.getElementById('createBtn');
let list = document.getElementById('list');

// Load saved notes from localStorage on page load
window.onload = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => createNote(note.content, note.color, note.left, note.top));
};

// CREATE NEW NOTE
createBtn.onclick = () => {
    createNote('', color.value);
    saveNotes(); // Save state after creating a new note
};

// Function to create a note and add it to the list
function createNote(content = '', color = '#000', left = '0px', top = '0px') {
    let newNote = document.createElement('div');
    newNote.classList.add('note');
    newNote.innerHTML = `
    <span class="close">x</span>
    <textarea placeholder="Write content..." rows="10" cols="30">${content}</textarea>`;
    newNote.style.borderColor = color;
    newNote.style.left = left;
    newNote.style.top = top;
    list.appendChild(newNote);

    // Save on text input changes
    newNote.querySelector('textarea').addEventListener('input', saveNotes);
}

// DELETE NOTE
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) {
        event.target.parentNode.remove();
        saveNotes(); // Save state after deleting a note
    }
});

// Save notes to localStorage
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const textarea = note.querySelector('textarea');
        notes.push({
            content: textarea.value,
            color: note.style.borderColor,
            left: note.style.left,
            top: note.style.top
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// DRAG - DROP EVENT HANDLING
let cursor = { x: null, y: null };
let note = { dom: null, x: null, y: null };

document.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('note')) {
        cursor = { x: event.clientX, y: event.clientY };
        note = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        };
    }
});

document.addEventListener('mousemove', (event) => {
    if (note.dom == null) return;
    let currentCursor = { x: event.clientX, y: event.clientY };
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    };

    note.dom.style.left = (note.x + distance.x) + 'px';
    note.dom.style.top = (note.y + distance.y) + 'px';
    note.dom.style.cursor = 'grab';
});

document.addEventListener('mouseup', () => {
    if (note.dom == null) return;
    note.dom.style.cursor = 'auto';
    note.dom = null;
    saveNotes(); // Save state after dragging a note
});

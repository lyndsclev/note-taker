// required 
const fs = require('fs');
const path = require('path');
const express = require('express'); 
const req = require('express/lib/request');
const { notes } = require('./db/db'); 
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 3001; 
const app = express(); 

// middleware needed to accept post data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// middleware to make files available
app.use(express.static('public'));

// create note
function createNote(body, notesArray) {
    const note = body; 
    notesArray.push(note); 

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}; 

// validate input
function validateNote(note) {
    if(!note.title) {
        return false; 
    }
    if(!note.text) {
        return false;
    }
    return true; 
}; 

// get notes api route
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// post notes api route 
app.post('/api/notes', (req, res) => {

    // set unique id with nanoid
    req.body.id = nanoid(5);

    // if data is empty, send alert
    if(!validateNote(req.body)) {
        res.status(400).send('Please include information for both Note Title and Note Text'); 
    } else {
        // add note to json file and notes array
        const note = createNote(req.body, notes);
        res.json(note);
    }
});

// delete notes method 
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);

    const { id } = req.params; 
    const newNotes = notes.filter(note => note.id != id);
    res.json(newNotes);
    console.log(newNotes);

    // re-write file - re-writes, but doesn't re-get... do i need to re-start the server? 
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify({ notes: newNotes }, null, 2)
    );
});

// get notes.html route 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// get index.html route 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
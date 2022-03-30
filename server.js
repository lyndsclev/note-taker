// required 
const fs = require('fs');
const path = require('path');
const express = require('express'); 
const req = require('express/lib/request');
const { notes } = require('./db/db'); 

const PORT = process.env.PORT || 3001; 
const app = express(); 

// middleware needed to accept post data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

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

// get notes 
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// post notes 
app.post('/api/notes', (req, res) => {

    // set id based on array index
    req.body.id = notes.length.toString();

    // if data is empty, send alert
    if(!validateNote(req.body)) {
        res.status(400).send('Please include information for both Note Title and Note Text'); 
    } else {
        // add note to json file and notes array
        const note = createNote(req.body, notes);
        res.json(note);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
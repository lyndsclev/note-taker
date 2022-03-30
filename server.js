// required 
const express = require('express'); 
const { notes } = require('./db/db'); 

const PORT = process.env.PORT || 3001; 
const app = express(); 

// middleware needed to accept post data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// get notes 
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// post notes 
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
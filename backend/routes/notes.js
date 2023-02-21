const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');



//Router 1:  Get All the Notes using: GET "/api/notes/fetchallnotes" . login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });    //fetch notes of corresponding user
        res.json(notes)                                          //send notes as response

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//Router 2:  Add a new Note using: POST "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters ').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if errors then return bad req and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }


})
//Router 3:  Update a existing Note using: PUT "/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        //create a newNote object
        const newNOte = {}
        if (title) { newNOte.title = title };
        if (description) { newNOte.description = description };
        if (tag) { newNOte.tag = tag };

        //Find the note to be updated amd update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {         //Matching the existing user id with the logged in user id 
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNOte }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//Router 4:  Delete a existing Note using: DELETE "/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {         //Matching the existing user id with the logged in user id 
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndRemove(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

})
module.exports = router
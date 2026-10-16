const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({});
	response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
	const note = await Note.findById(request.params.id);
	if (note) {
		response.json(note);
	} else {
		response.status(404).json({ message: "note does not exist" });
	}
});

notesRouter.post("/", async (request, response) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	const savedNote = await note.save();
	response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
	const { content, important } = request.body;
	const noteToUpdate = await Note.findById(request.params.id);

	if (!noteToUpdate) {
		return response.status(404).json({ message: "note was not found" });
	}

	noteToUpdate.content = content;
	noteToUpdate.important = important;

	const updatedNote = await noteToUpdate.save();
	response.json(updatedNote);
});

module.exports = notesRouter;

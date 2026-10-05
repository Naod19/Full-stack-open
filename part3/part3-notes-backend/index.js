require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

app.get("/api/notes", (req, res) => {
	Note.find({}).then((notes) => res.json(notes));
});

app.get("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;
	Note.findById(id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(400).json({ error: "malformatted id" });
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.put("/api/notes/:id", (req, res) => {
	const { content, important } = req.body;

	if (!content) {
		return res.status(400).json({
			error: "content missing",
		});
	}

	Note.findById(req.params.id)
		.then((note) => {
			if (!note) {
				return res.status(404).end();
			}

			note.content = content;
			note.important = important;

			return note.save().then((updatedNote) => res.json(updatedNote));
		})
		.catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
	const id = req.params.id;
	Note.findByIdAndDelete(id)
		.then((result) => res.status(204).end())
		.catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "Malformatted id" });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`App is running on port http://localhost:${PORT}`);
});

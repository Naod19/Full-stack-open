require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 3) {
	process.exit(1);
}

const url = process.env.TEST_MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4, dbName: "noteApp" });

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

if (!process.argv[2] && !process.argv[3]) {
	Note.find({}).then((result) => {
		if (result.length === 0) {
			console.log("Database is empty");
		}
		result.forEach((note) => console.log(note));
		mongoose.connection.close();
	});
} else {
	const note = new Note({
		content: process.argv[2],
		important: process.argv[3] === "true" || false,
	});

	note.save().then(() => {
		console.log(`added ${process.argv[2]} ${process.argv[3]} to notes`);
		mongoose.connection.close();
	});
}

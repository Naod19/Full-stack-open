const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://naodyemane96_db_user:${password}@naod-backend-m0.ja3q76w.mongodb.net/?appName=naod-backend-m0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4, dbName: "exampleDB" });

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "Html is easy",
//   important: true,
// });

Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note);
	});
	mongoose.connection.close();
});

// note.save().then((result) => {
//   console.log("note saved");
//   mongoose.connection.close();
// });

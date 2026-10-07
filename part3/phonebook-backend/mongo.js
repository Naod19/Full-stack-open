const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Please provide the MongoDB password as the third argument\n node <filename.js> <password>",
	);
	process.exit(1);
}

const password = process.argv[2];

const URL = `mongodb+srv://naodyemane96_db_user:${password}@naod-backend-m0.ja3q76w.mongodb.net/?appName=naod-backend-m0`;

mongoose.set("strictQuery", false);

mongoose.connect(URL, { family: 4, dbName: "phonebookDB" });

const personSchema = new mongoose.Schema({
	name: String,
	phoneNum: String,
});

const Person = mongoose.model("Person", personSchema);

if (!process.argv[3] && !process.argv[4]) {
	Person.find({}).then((result) => {
		if (result.length === 0) {
			console.log("Database is empty");
		}
		result.forEach((person) => console.log(person));
		mongoose.connection.close();
	});
} else {
	const person = new Person({
		name: process.argv[3],
		phoneNum: process.argv[4],
	});

	person.save().then(() => {
		console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`);
		mongoose.connection.close();
	});
}

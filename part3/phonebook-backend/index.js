require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("request-body", (req, res) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	}
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :request-body",
	),
);

app.get("/info", (req, res) => {
	console.log(Person.length);
	const time = new Date();
	Person.countDocuments().then((result) => {
		res.send(`Phonebook has info for ${result} people
       <br>
  ${time}`);
	});
});

//Get all persons
app.get("/api/persons", (req, res) => {
	Person.find({}).then((person) => res.send(person));
});

//Get a person
app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id;

	Person.findById(id).then((person) => res.json(person));
});

//Add a new person
app.post("/api/persons", async (req, res, next) => {
	const body = req.body;
	const existingPerson = await Person.findOne({ name: body.name });

	if (!body.name || !body.phoneNum) {
		return res.status(400).json({ error: "entries must not be empty" });
	} else if (existingPerson) {
		return res.status(400).json({ error: "name must be unique" });
	}

	const person = new Person({
		name: body.name,
		phoneNum: body.phoneNum,
	});

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson);
		})
		.catch((error) => next(error));
});

//Delete a person
app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	Person.findByIdAndDelete(id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

//Update a person
app.put("/api/persons/:id", (req, res, next) => {
	const { phoneNum } = req.body;
	Person.findById(req.params.id)
		.then((person) => {
			if (!person) {
				return res.status(404).end();
			}

			person.phoneNum = phoneNum;

			return person
				.save()
				.then((updatedPerson) => res.json(updatedPerson));
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ message: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return res.status(400).json({ error: "Malformatted id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`App is running on Port http://localhost:${PORT}`);
});

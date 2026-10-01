require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("request-body", function (req, res) {
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
  const time = new Date();
  res.send(`Phonebook has info for ${phoneList.length} people
    <br>
  ${time}`);
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

//Delete a person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phoneList = phoneList.filter((person) => person.id !== id);

  res.status(204).end();
});

//Add a new person
app.post("/api/persons", async (req, res) => {
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

  person.save().then((savedPerson) => res.json(savedPerson));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ message: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

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

let phoneList = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const time = new Date();
  res.send(`Phonebook has info for ${phoneList.length} people
    <br>
  ${time}`);
});

//Get all persons
app.get("/api/persons", (req, res) => {
  res.json(phoneList);
});

//Get a person
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phoneList.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//Delete a person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phoneList = phoneList.filter((person) => person.id !== id);

  res.status(204).end();
});

//Add a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const existingPerson = phoneList.some((person) => person.name === body.name);

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "entries must not be empty" });
  } else if (existingPerson) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: String(Math.random() * 10),
    name: body.name,
    number: body.number,
  };

  phoneList = [...phoneList, person];

  res.json(person);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ message: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

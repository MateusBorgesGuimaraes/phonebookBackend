const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

function getTamanho() {
  return persons.length;
}

function getDate() {
  return new Date();
}

const generateId = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

app.get("/", (request, response) => {
  response.send("<h1>Ola mundo</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<h3>Phonebook has info for ${getTamanho()} people</h3> <h3>${getDate()}</h3>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((note) => note.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const exist = persons.some((person) => person.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  } else if (exist) {
    return response.status(400).json({
      error: "name must be unique ",
    });
  }

  const person = {
    id: generateId(1, 1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

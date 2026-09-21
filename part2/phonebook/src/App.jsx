import { useState } from "react";
import phoneService from "./services/phones";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import { useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phoneService.getAll().then((allNumbers) => {
      setPersons(allNumbers);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isExisting = persons.some((person) => person.name === newName);
    if (isExisting) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const existingObject = persons.find(
          (person) => person.name === newName,
        );

        const updatedObject = { ...existingObject, number: phoneNumber };

        phoneService
          .update(existingObject.id, updatedObject)
          .then((updatedPerson) =>
            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person,
              ),
            ),
          )
          .catch((error) => {
            setMessage({
              content: `Information of ${existingObject.name} has already been removed from the server`,
              type: "error",
            });
            console.log(error);

            setPersons(
              persons.filter((person) => person.id !== existingObject.id),
            );
          });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: phoneNumber,
    };

    phoneService
      .create(newPerson)
      .then((returnedData) => setPersons([...persons, returnedData]));
    setNewName("");
    setPhoneNumber("");
    setMessage({
      content: `added ${newName}`,
      type: "success",
    });
  };

  const handleDelete = (id) => {
    phoneService.remove(id);
    setPersons(persons.filter((person) => person.id !== id));
  };

  const filteredList = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} setMessage={setMessage} />
      <Filter value={filter} onInput={handleFilterChange} />
      <h1>Add a new</h1>
      <PersonForm
        onSubmit={handleSubmit}
        nameValue={newName}
        onNameChange={handleNameChange}
        phoneValue={phoneNumber}
        onPhoneChange={handleNumberChange}
      />
      <h1>Numbers</h1>
      <Persons list={filteredList} onClick={handleDelete} />
    </div>
  );
};

export default App;

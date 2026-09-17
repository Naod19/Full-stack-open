import { useState } from "react";
import phoneService from "./services/phones";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [filter, setFilter] = useState("");

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
            console.log(
              error,
              `${existingObject.name} has already been deleted`,
            );
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
      <h2>Phonebook</h2>
      <Filter value={filter} onInput={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleSubmit}
        nameValue={newName}
        onNameChange={handleNameChange}
        phoneValue={phoneNumber}
        onPhoneChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons list={filteredList} onClick={handleDelete} />
    </div>
  );
};

export default App;

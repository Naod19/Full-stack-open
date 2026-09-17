const Persons = ({ list, onClick }) => {
  return (
    <div>
      {list.map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}
          <button
            onClick={() => {
              if (window.confirm(`delete ${person.name} ?`)) onClick(person.id);
            }}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Persons;

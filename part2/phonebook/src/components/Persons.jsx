const Persons = ({ list }) => {
  return (
    <div>
      {list.map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}
        </div>
      ))}
    </div>
  );
};

export default Persons;

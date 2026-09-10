const Filter = ({ value, onInput }) => {
  return (
    <div>
      filter shown with: <input value={value} onChange={onInput} />
    </div>
  );
};

export default Filter;

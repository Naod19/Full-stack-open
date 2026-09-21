import Country from "./Country";

const CountryList = ({ list, showCountry, handleShowCountry }) => {
  if (list.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (list.length === 1) {
    return list.map((item) => <Country data={item} key={item.ccn3} />);
  }

  return (
    <>
      {list.map((item) => (
        <div key={item.ccn3}>
          <p>
            {item.name.common}{" "}
            <button onClick={() => handleShowCountry(item.ccn3)}>
              {showCountry === item.ccn3 ? "Hide" : "Show"}
            </button>
          </p>
          <div>{showCountry === item.ccn3 && <Country data={item} />}</div>
        </div>
      ))}
    </>
  );
};

export default CountryList;

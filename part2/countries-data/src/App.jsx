import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";

const countryURL = "https://studies.cs.helsinki.fi/restcountries/api/all";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    axios.get(countryURL).then((response) => setCountries(response.data));
  }, []);

  const list = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  const handleShowCountry = (id) => {
    setShowCountry(showCountry === id ? null : id);
  };

  return (
    <div>
      <label>Find Countries:</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <CountryList
          list={list}
          showCountry={showCountry}
          handleShowCountry={handleShowCountry}
        />
      )}
    </div>
  );
};

export default App;

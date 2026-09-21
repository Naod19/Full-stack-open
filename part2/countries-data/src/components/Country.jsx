import Weather from "./Weather";

const Country = ({ data }) => {
  return (
    <div key={data.ccn3}>
      <h1>{data.name.common}</h1>
      <p>
        Capital{" "}
        {data.capital ? data.capital.map((cap) => `${cap}`) : "No capital"}
      </p>
      <p>Area: {data.area} </p>
      <h2>Language</h2>
      <ul>
        {Object.entries(data.languages).map(([key, lang]) => (
          <li key={key}>{lang}</li>
        ))}
      </ul>
      <img src={data.flags.png} alt="" />
      <Weather city={data.capital?.[0]} />
    </div>
  );
};

export default Country;

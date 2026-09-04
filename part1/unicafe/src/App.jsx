import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => (
  <p>
    {text}: {value}
  </p>
);

const Statistics = ({
  good,
  neutral,
  bad,
  total,
  averagePercentage,
  positivePercentage,
}) => {
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <StatisticLine text="Good" />
            </td>
            <td>
              <StatisticLine value={good} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text="Neutral" />
            </td>
            <td>
              <StatisticLine value={neutral} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text="Bad" />
            </td>
            <td>
              <StatisticLine value={bad} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text="All" />
            </td>
            <td>
              <StatisticLine value={total} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text="Average" />
            </td>
            <td>
              <StatisticLine value={averagePercentage + "%"} />
            </td>
          </tr>
          <tr>
            <td>
              <StatisticLine text="Positive" />
            </td>
            <td>
              <StatisticLine value={positivePercentage + "%"} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;

  const averagePercentage = (good * 1 + neutral * 0 + bad * -1) / total;

  const positivePercentage = (good / total) * 100;

  const handleGoodFeedback = () => {
    setGood(good + 1);
  };

  const handleNeutralFeedback = () => {
    setNeutral(neutral + 1);
  };

  const handleBadFeedback = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodFeedback} text="Good" />
      <Button onClick={handleNeutralFeedback} text="Neutral" />
      <Button onClick={handleBadFeedback} text="Bad" />
      {good > 0 || neutral > 0 || bad > 0 ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          averagePercentage={averagePercentage}
          positivePercentage={positivePercentage}
        />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

export default App;

import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(() => {
    return new Uint8Array(8);
  });

  const handleGeneration = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const handleVotes = (index) => {
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
  };

  const highestIndex = Math.max(...votes);
  const highestVote = votes.indexOf(highestIndex);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      has {votes[selected]} votes
      <div>
        <button onClick={() => handleVotes(selected)}>Vote</button>
        <button onClick={handleGeneration}>Next anecdote</button>
      </div>
      <div>
        <h1>Anecdote with the most votes</h1>
        {highestIndex > 0 && (
          <div>
            {anecdotes[highestVote]}
            <br />
            has {votes[highestVote]} votes.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

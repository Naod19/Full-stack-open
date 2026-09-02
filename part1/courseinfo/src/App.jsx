// Header component renders the course name
const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

// Part component renders the individual p tags
const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  );
};

// Content component renders the parts and the number of exercises of the parts.
const Content = (props) => {
  return (
    <div>
      <Part
        part={props.course.parts[0].name}
        exercises={props.course.parts[0].exercises}
      />
      <Part
        part={props.course.parts[1].name}
        exercises={props.course.parts[1].exercises}
      />
      <Part
        part={props.course.parts[2].name}
        exercises={props.course.parts[2].exercises}
      />
    </div>
  );
};

// Total component renders the total number of exercises
const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.exercises.parts[0].exercises +
        props.exercises.parts[1].exercises +
        props.exercises.parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total exercises={course} />
    </div>
  );
};

export default App;

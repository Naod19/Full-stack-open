const Header = ({ course }) => <h2>{course}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Section = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part part={part} key={part.id} />
      ))}
    </>
  );
};

const Total = ({ course }) => {
  const total = course.reduce((total, part) => {
    return total + part.exercises;
  }, 0);
  return <strong>Total of {total} exercises</strong>;
};

const Content = ({ course }) => (
  <div>
    {course.map((course) => (
      <div key={course.id}>
        <Header course={course.name} />
        <Section parts={course.parts} />
        <Total course={course.parts} />
      </div>
    ))}
  </div>
);

const Course = ({ course }) => {
  return (
    <div>
      <Content course={course} />
    </div>
  );
};

export default Course;

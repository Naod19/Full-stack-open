const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
  };

  return (
    <div style={footerStyle}>
      <br />
      <p>
        Note app, Department of Computer Science, University of Helsinki{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;

import { useEffect } from "react";

const Notification = ({ message, setMessage }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (message === null) {
    return null;
  }

  return (
    <div className={`${message.type === "success" ? "success" : "error"}`}>
      {message.content}
    </div>
  );
};

export default Notification;

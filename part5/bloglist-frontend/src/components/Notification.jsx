const Notification = ({ message }) => {
	return (
		<div className={`notification ${message.status}`}>
			<p>{message.content}</p>
		</div>
	);
};

export default Notification;

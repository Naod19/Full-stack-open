import { useImperativeHandle, useState } from "react";

const Togglable = ({ children, buttonLabel, ref }) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisble = { display: visible ? "none" : "" };
	const showWhenVisble = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible((prev) => !prev);
	};

	useImperativeHandle(ref, () => {
		return { toggleVisibility };
	});

	return (
		<div>
			<div style={hideWhenVisble}>
				<button type="button" onClick={toggleVisibility}>
					{buttonLabel}
				</button>
			</div>
			<div style={showWhenVisble}>
				{children}
				<button type="button" onClick={toggleVisibility}>
					cancel
				</button>
			</div>
		</div>
	);
};

export default Togglable;

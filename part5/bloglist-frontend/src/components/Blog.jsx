import { useState } from "react";

const btnStyle = {
	width: "fit-content",
	backgroundColor: "red",
	color: "white",
	border: "none",
	borderRadius: 5,
	padding: "5px 10px",
};

const blogStyle = {
	display: "flex",
	flexDirection: "column",
	padding: 10,
	border: "solid",
	borderWidth: 1,
	margin: "10px 0",
};

const Blog = ({ blog, user, handleLikeUpdate, onDelete }) => {
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => {
		setVisible((prev) => !prev);
	};

	return (
		<div style={blogStyle}>
			<span>
				{blog.title} {blog.author}{" "}
				<button type="button" onClick={toggleVisibility}>
					{visible ? "hide" : "view"}
				</button>
			</span>
			{visible && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<span>{blog.url}</span>
					<span>
						likes: {blog.likes}{" "}
						<button
							type="button"
							onClick={() => handleLikeUpdate(blog.id)}
						>
							Like
						</button>
					</span>
					<span>{blog.user.username}</span>
					{user.userId === blog.user.id && (
						<button
							style={btnStyle}
							type="button"
							onClick={() => onDelete(blog.id)}
						>
							remove
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Blog;

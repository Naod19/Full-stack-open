import { useImperativeHandle, useState } from "react";

const emptyBlog = {
	title: "",
	author: "",
	url: "",
};

const CreateBlog = ({ ref, createBlog }) => {
	const [newBlog, setNewBlog] = useState(emptyBlog);
	const [isVisible, setIsVisible] = useState(false);

	useImperativeHandle(ref, () => ({ toggleVisibility }));

	const toggleVisibility = () => {
		setIsVisible((prev) => !prev);
	};

	const handleBlogChange = (e) => {
		const { name, value } = e.target;
		setNewBlog((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreateBlog = (e) => {
		e.preventDefault();
		createBlog(newBlog);
		setNewBlog(emptyBlog);
	};

	return (
		<>
			{isVisible ? (
				<form onSubmit={handleCreateBlog}>
					<h4>Create new</h4>
					<div>
						<label>
							Title
							<input
								name="title"
								type="text"
								value={newBlog.title}
								onChange={handleBlogChange}
							/>
						</label>
					</div>
					<div>
						<label>
							Author
							<input
								name="author"
								type="text"
								value={newBlog.author}
								onChange={handleBlogChange}
							/>
						</label>
					</div>
					<div>
						<label>
							Url
							<input
								name="url"
								type="text"
								value={newBlog.url}
								onChange={handleBlogChange}
							/>
						</label>
					</div>
					<button type="submit">Create</button>
					<br />
					<button type="button" onClick={toggleVisibility}>
						Cancel
					</button>
				</form>
			) : (
				<button type="button" onClick={toggleVisibility}>
					Create new blog
				</button>
			)}
		</>
	);
};

export default CreateBlog;

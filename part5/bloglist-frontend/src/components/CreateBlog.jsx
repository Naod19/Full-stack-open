const CreateBlog = ({ onSubmit, newBlog, onChange }) => {
	return (
		<form onSubmit={onSubmit}>
			<h4>Create new</h4>
			<div>
				<label>
					Title
					<input
						name="title"
						type="text"
						value={newBlog.title}
						onChange={(e) => onChange(e)}
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
						onChange={(e) => onChange(e)}
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
						onChange={(e) => onChange(e)}
					/>
				</label>
			</div>
			<button type="submit">Create</button>
		</form>
	);
};

export default CreateBlog;

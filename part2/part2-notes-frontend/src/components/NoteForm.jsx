const NoteForm = ({ onSubmit, inputValue, onChange }) => {
	return (
		<form onSubmit={onSubmit}>
			<input
				type="text"
				value={inputValue}
				onChange={(e) => onChange(e)}
			/>
			<button type="submit">Save</button>
		</form>
	);
};

export default NoteForm;

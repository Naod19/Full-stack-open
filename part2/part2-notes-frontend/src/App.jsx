import { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm.jsx";
import Note from "./components/Note";
import NoteForm from "./components/NoteForm.jsx";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable.jsx";
import loginService from "./services/login.js";
import noteService from "./services/notes";

const App = () => {
	const [notes, setNotes] = useState([]);
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [user, setUser] = useState(null);

	const noteFormRef = useRef();

	useEffect(() => {
		const fecthAllNotes = async () => {
			const notes = await noteService.getAll();
			setNotes(notes);
		};
		fecthAllNotes();
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");

		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			noteService.setToken(user.token);
		}
	}, []);

	const addNote = async (noteObject) => {
		noteFormRef.current.toggleVisibility();
		try {
			const savedNote = await noteService.create(noteObject);
			if (savedNote) {
				setNotes([...notes, savedNote]);
			}
		} catch (error) {
			console.log(error.response.data);
			setErrorMessage(error.response.data.error);
		}
	};

	const toggleImportanceOf = async (id) => {
		const note = notes.find((note) => note.id === id);
		const changedNote = { ...note, important: !note.important };

		try {
			const updatedNote = await noteService.update(id, changedNote);
			if (updatedNote) {
				setNotes(
					notes.map((note) => (note.id === id ? updatedNote : note)),
				);
			}
		} catch (error) {
			setErrorMessage(
				`the note '${note.content}' was already deleted from the server`,
			);
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
			setNotes(notes.filter((n) => n.id !== id));
			console.log(error);
		}
	};

	const handleLogin = async (credentials) => {
		try {
			const user = await loginService.login(credentials);

			window.localStorage.setItem(
				"loggedNoteappUser",
				JSON.stringify(user),
			);

			noteService.setToken(user.token);
			setUser(user);
		} catch (error) {
			console.log(error.response.data);
			setErrorMessage(error.response.data.error);
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const loginForm = () => {
		return (
			<div>
				<Togglable buttonLabel="log in">
					<LoginForm login={handleLogin} />
				</Togglable>
			</div>
		);
	};

	const noteToShow = showAll ? notes : notes.filter((note) => note.important);

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			{!user && loginForm()}
			{user && (
				<div>
					<p>{user.name} logged in</p>
					<Togglable buttonLabel="new note" ref={noteFormRef}>
						<NoteForm createNote={addNote} />
					</Togglable>
				</div>
			)}

			<div>
				<button type="button" onClick={() => setShowAll(!showAll)}>
					Show {showAll ? "important" : "all"}
				</button>
			</div>
			<ul>
				{noteToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={toggleImportanceOf}
					/>
				))}
			</ul>
			<Footer />
		</div>
	);
};

export default App;

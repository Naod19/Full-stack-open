import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm.jsx";
import Note from "./components/Note";
import NoteForm from "./components/NoteForm.jsx";
import Notification from "./components/Notification";
import loginService from "./services/login.js";
import noteService from "./services/notes";

const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		noteService.getAll().then((initialNotes) => {
			setNotes(initialNotes);
		});
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");

		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			noteService.setToken(user.token);
		}
	}, []);

	const addNote = (e) => {
		e.preventDefault();
		const noteObject = {
			content: newNote,
			important: Math.random() < 0.5,
		};

		noteService.create(noteObject).then((returnedNote) => {
			setNotes([...notes, returnedNote]);
			setNewNote("");
		});
	};

	const handleNoteChange = (e) => {
		setNewNote(e.target.value);
	};

	const toggleImportanceOf = (id) => {
		const note = notes.find((note) => note.id === id);
		const changedNote = { ...note, important: !note.important };

		noteService
			.update(id, changedNote)
			.then((updatedNote) =>
				setNotes(
					notes.map((note) => (note.id === id ? updatedNote : note)),
				),
			)
			.catch((error) => {
				setErrorMessage(
					`the note '${note.content}' was already deleted from the server`,
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
				setNotes(notes.filter((n) => n.id !== id));
				console.log(error);
			});
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const user = await loginService.login({ username, password });

			window.localStorage.setItem(
				"loggedNoteappUser",
				JSON.stringify(user),
			);

			noteService.setToken(user.token);
			setUser(user);
			setUsername("");
			setPassword("");
		} catch {
			setErrorMessage("wrong credentianls");
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const noteToShow = showAll ? notes : notes.filter((note) => note.important);

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			{!user && (
				<LoginForm
					onSubmit={handleLogin}
					usernameValue={username}
					onUsernameChange={setUsername}
					passwordValue={password}
					onPasswordChange={setPassword}
				/>
			)}
			{user && (
				<div>
					<p>{user.name} logged in</p>
					<NoteForm
						onSubmit={addNote}
						inputValue={newNote}
						onChange={handleNoteChange}
					/>
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

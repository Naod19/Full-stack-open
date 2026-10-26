import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const emptyBlog = {
	title: "",
	author: "",
	url: "",
};

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [newBlog, setNewBlog] = useState(emptyBlog);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState("");

	useEffect(() => {
		const fetchBlogs = async () => {
			const blogs = await blogService.getAll();
			setBlogs(blogs);
		};

		fetchBlogs();
	}, []);

	useEffect(() => {
		const userInJSON = localStorage.getItem("userLoggedIn");
		if (!userInJSON) return;

		const user = JSON.parse(userInJSON);
		setUser(user);
		blogService.setToken(user.token);
	}, []);

	const handleBlogChange = (e) => {
		const { name, value } = e.target;
		setNewBlog((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreateBlog = async (e) => {
		e.preventDefault();
		try {
			const createdBlog = await blogService.createBlog(newBlog);
			setNewBlog(emptyBlog);
			setBlogs((prev) => [...prev, createdBlog]);
			setNotification({
				content: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
				status: "success",
			});
			setTimeout(() => setNotification(null), 3000);
		} catch (error) {
			setNotification({
				content: `${error.response.data.error}`,
				status: "error",
			});
			setTimeout(() => setNotification(null), 3000);
			console.error(error.response.data);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const user = await loginService.login({ username, password });
			localStorage.setItem("userLoggedIn", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername("");
			setPassword("");
		} catch (error) {
			setNotification({
				content: "Wrong username or password",
				status: "error",
			});
			setTimeout(() => setNotification(null), 3000);
			console.error(error.response.data);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("userLoggedIn");
		setUser(null);
		blogService.setToken(null);
	};

	return (
		<div>
			<h1>Blogs</h1>
			{notification && <Notification message={notification} />}
			{!user ? (
				<LoginForm
					onSubmit={handleLogin}
					usernameValue={username}
					onUsernameChange={setUsername}
					passwordValue={password}
					onPasswordChange={setPassword}
				/>
			) : (
				<>
					<p>{user.name} is logged in</p>
					<button type="button" onClick={handleLogout}>
						logout
					</button>
					<h2>blogs</h2>
					{blogs.map((blog) => (
						<Blog key={blog.id} blog={blog} />
					))}
					<CreateBlog
						onSubmit={handleCreateBlog}
						onChange={handleBlogChange}
						newBlog={newBlog}
					/>
				</>
			)}
		</div>
	);
};

export default App;

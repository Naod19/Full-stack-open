import { useEffect, useRef, useState } from "react";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState("");

	const blogFormRef = useRef();

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

	const notificationTimer = (notification) => {
		setNotification(notification);
		setTimeout(() => {
			setNotification(null);
		}, 3000);
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
			notificationTimer();
			notificationTimer({
				content: "Wrong username or password",
				status: "error",
			});
			console.error(error.response.data);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("userLoggedIn");
		setUser(null);
		blogService.setToken(null);
	};

	const handleCreateBlog = async (newBlog) => {
		try {
			const createdBlog = await blogService.createBlog(newBlog);

			if (createdBlog) {
				blogFormRef.current.toggleVisibility();
				setBlogs((prev) => [...prev, createdBlog]);
				notificationTimer({
					content: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
					status: "success",
				});
			}
		} catch (error) {
			if (error?.response?.data?.error === "Token exipred") {
				return notificationTimer({
					content: "Login token expired, please log in back",
					status: "error",
				});
			}

			notificationTimer({
				content: `${error?.response?.data?.error}`,
				status: "error",
			});
			console.error(error.response.data);
		}
	};

	const handleLikeUpdate = async (blogId) => {
		const blogToUpdate = blogs.find((blog) => blog.id === blogId);
		const updatedBlog = { likes: blogToUpdate.likes + 1 };
		try {
			const returnedBlog = await blogService.updateBlog(
				blogId,
				updatedBlog,
			);
			if (returnedBlog) {
				setBlogs((prev) =>
					prev.map((blog) =>
						blog.id === blogToUpdate.id ? returnedBlog : blog,
					),
				);
			}
		} catch (error) {
			notificationTimer({
				content: error?.response?.data?.error,
				status: "error",
			});
			console.log(error.response);
		}
	};

	const handleDeleteBlog = async (blogId) => {
		const blogToDelete = blogs.find((blog) => blog.id === blogId);
		const confirmation = window.confirm(
			`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
		);

		if (confirmation) {
			await blogService.deleteBlog(blogId);
			setBlogs(blogs.filter((blog) => blog.id !== blogId));
		}
	};

	const blogsSorted = [...blogs].sort((a, b) => b.likes - a.likes);

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
					<div>
						<span>{user.name} is logged in</span>
						<button type="button" onClick={handleLogout}>
							logout
						</button>
					</div>
					<br />
					<CreateBlog
						ref={blogFormRef}
						createBlog={handleCreateBlog}
					/>
					<br />
					{blogsSorted.map((blog) => (
						<Blog
							key={blog.id}
							blog={blog}
							user={user}
							handleLikeUpdate={handleLikeUpdate}
							onDelete={handleDeleteBlog}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default App;

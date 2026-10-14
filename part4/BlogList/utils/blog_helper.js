const Blog = require("../models/blog");

const intialBlogs = [
	{
		title: "Why You Should Learn TypeScript in 2026",
		author: "Ethan Brooks",
		url: "https://example.com/blog/learn-typescript-2026",
		likes: 156,
	},
	{
		title: "Getting Started with React Hooks",
		author: "Amara Okafor",
		url: "https://example.com/blog/getting-started-with-react-hooks",
		likes: 142,
	},
	{
		title: "Understanding the JavaScript Event Loop",
		author: "Daniel Mugisha",
		url: "https://example.com/blog/javascript-event-loop",
		likes: 98,
	},
	{
		title: "Building REST APIs with Express and MongoDB",
		author: "Sofia Martinez",
		url: "https://example.com/blog/rest-apis-express-mongodb",
		likes: 215,
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

module.exports = { intialBlogs, blogsInDb };

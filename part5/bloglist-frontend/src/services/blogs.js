import axios from "axios";

const baseUrl = "/api/blogs";

let token;

const setToken = (newToken) => (token = `Bearer ${newToken}`);

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const createBlog = async (blog) => {
	const response = await axios.post(baseUrl, blog, {
		headers: {
			Authorization: token,
		},
	});

	return response.data;
};

export default { getAll, createBlog, setToken };

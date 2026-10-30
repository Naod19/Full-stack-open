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

const updateBlog = async (id, blog) => {
	const response = await axios.put(`${baseUrl}/${id}`, blog);
	return response.data;
};

const deleteBlog = async (id) => {
	const config = { headers: { Authorization: token } };
	await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, createBlog, updateBlog, deleteBlog, setToken };

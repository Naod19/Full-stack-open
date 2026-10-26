import axios from "axios";

const baseUrl = "/api/login";

const login = async (credentionals) => {
	const response = await axios.post(baseUrl, credentionals);
	return response.data;
};

export default { login };

import axios from "axios";

const baseUrl = "/api/login";

const login = async (credentianls) => {
	const response = await axios.post(baseUrl, credentianls);
	return response.data;
};

export default { login };

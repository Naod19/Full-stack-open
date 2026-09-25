import axios from "axios";

const url = "/api/persons";

const getAll = () => {
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const create = (newPhone) => {
  const request = axios.post(url, newPhone);
  return request.then((response) => response.data);
};

const update = (id, updatedPhone) => {
  const request = axios.put(`${url}/${id}`, updatedPhone);
  return request.then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${url}/${id}`);
};

export default { getAll, create, update, remove };

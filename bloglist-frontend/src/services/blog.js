import axios from "axios";
const baseUrl = "/api/blogs";

let token;

const setToken = (storedToken) => {
  token = `Bearer ${storedToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token,
  },
});

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {

  const response = await axios.post(baseUrl, newObject, getConfig());
  return response.data;
};

const update = async (id, updatedObject) => {
  const url = `${baseUrl}/${id}`;


  const response = await axios.put(url, updatedObject, getConfig());
  return response.data;
};

const deleteItem = async (id) => {
  const url = `${baseUrl}/${id}`;

  const response = await axios.delete(url, getConfig());

  return response.data;
}

export default {
  getAll,
  create,
  update,
  deleteItem,
  setToken,
};

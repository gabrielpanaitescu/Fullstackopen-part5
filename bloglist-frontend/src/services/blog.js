import axios from "axios";
const baseUrl = "/api/blogs";

let token;

const setToken = (storedToken) => {
  token = `Bearer ${storedToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, updatedObject) => {
  const url = `${baseUrl}/${id}`;
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.put(url, updatedObject, config);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  setToken,
};

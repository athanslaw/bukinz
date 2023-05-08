import axios from 'axios';

const baseApiCall = async (attrs) => {
  let token = localStorage.getItem('access_token');
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const axiosInstance = axios.create({
    headers,
  });
  return axiosInstance;
};

export const login = async (payload) => {
  await localStorage.multiGet([
    ['user', JSON.stringify(payload.user)],
    ['access_token', JSON.stringify(payload.token)],
  ]);
};

export const logout = async () => {
  await localStorage.clear();
};

const apiCall = async (url, httpMethod, body, additionalParams) => {
  const axiosInstance = await baseApiCall();
  switch (httpMethod) {
    case 'post':
    case 'put':
    case 'patch':
      return axiosInstance[httpMethod](url, body, additionalParams);
    case 'get':
      return axiosInstance[httpMethod](url, body);
    case 'delete':
      return axiosInstance[httpMethod](url);
    default:
      return axiosInstance[httpMethod](url);
  }
};

const apiRequest = async (
  url,
  httpMethod,
  body = {},
  additionalParams = {}
) => {
  return new Promise(function (resolve, reject) {
    apiCall(url, httpMethod, body, additionalParams)
      .then((response) => {
        if (response.data.status === 401) {
          return;
        }
        if (response.status < 400) {
          if (response.data.status !== 400) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        } else {
          reject(response.data);
        }
      })
      .catch((err) => {
        if (err.response) {
          reject(err);
        }
        else{
          reject(err);
        }
      });
  });
};

export {apiRequest};

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/'; // adjust to your backend API URL

export const getBooks = () => {
    return axios.get(`${API_URL}books`);
};

export const addBook = (book) => {
    return axios.post(`${API_URL}books`, book);
};

export const updateBook = (id, book) => {
    return axios.put(`${API_URL}books/${id}`, book);
};

export const deleteBook = (id) => {
    return axios.delete(`${API_URL}books/${id}`);
};

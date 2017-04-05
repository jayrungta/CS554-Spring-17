import { processRequest } from '../Utils/api';
const baseUrl = "http://localhost:3001";

export const getFirstPage = () => {
    return processRequest(`${baseUrl}/`, "GET", {}, false);
}

export const getUserList = (page) => {
    return processRequest(`${baseUrl}/archive/${page}`, "GET", {}, false);
}

export const getUser = (id) => {
    if (!id) return Promise.reject(new Error("An ID is required to get a user by ID"));
    return processRequest(`${baseUrl}/user/${id}`, "GET", {}, false);
}

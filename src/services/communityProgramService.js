import axios from 'axios';

const API_URL = '/api/CommunityPrograms';

export const getAllCommunityPrograms = (token) =>
    axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const getCommunityProgramById = (id) => axios.get(`${API_URL}/${id}`);

export const createCommunityProgram = (data, token) =>
    axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const updateCommunityProgram = (id, data, token) =>
    axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const deleteCommunityProgram = (id, token) =>
    axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    }); 
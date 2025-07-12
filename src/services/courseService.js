import axios from 'axios';

const API_URL = '/api/Course';

export const getAllCourses = (token) =>
    axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });

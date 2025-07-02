// Service lấy danh sách user
import axios from 'axios';

export async function getAllUsers(token) {
    return axios.get('/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
    });
} 
// Service lấy danh sách user
import axios from 'axios';

export async function getAllUsers(token) {
    return axios.get('/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
    });
} 

export async function getConsultantByUserId(token, userId) {
  return axios.get(`/api/Users/consultant/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getMyUserInfo(token) {
  return axios.get('/api/Users/my-user', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
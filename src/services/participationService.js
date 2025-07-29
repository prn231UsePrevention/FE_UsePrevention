import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:7233/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// User tham gia chương trình
export const joinProgram = (programId, preSurvey = '', postSurvey = '') =>
    apiClient.post('/Participation', { programId, preSurvey, postSurvey });

// Lấy danh sách chương trình user đã tham gia
export const getMyParticipations = () =>
    apiClient.get('/Participation/my');

// Admin: Lấy danh sách người tham gia của 1 chương trình
export async function getParticipantsByProgram(programId, token) {
    // Gọi API lấy toàn bộ participation, sau đó lọc theo programId
    const res = await axios.get('/api/Participation', {
        headers: { Authorization: `Bearer ${token}` }
    });
    // Lọc danh sách theo programId
    return {
        ...res,
        data: Array.isArray(res.data) ? res.data.filter(p => p.programId === programId) : []
    };
}

// Cập nhật thông tin tham gia (nếu có)
export const updateParticipation = (participationId, data, token) =>
    axios.put(`${API_URL}/${participationId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });

// Xóa tham gia (admin hoặc user tự rút)
export const deleteParticipation = (participationId, token) =>
    axios.delete(`${API_URL}/${participationId}`, {
        headers: { Authorization: `Bearer ${token}` }
    }); 
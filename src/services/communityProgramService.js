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

export const communityProgramService = {
    getAllCommunityPrograms() {
        return apiClient.get('/CommunityPrograms');
    },
    getCommunityProgramById(id) {
        return apiClient.get(`/CommunityPrograms/${id}`);
    },
    createCommunityProgram(data) {
        return apiClient.post('/CommunityPrograms', data);
    },
    updateCommunityProgram(id, data) {
        return apiClient.put(`/CommunityPrograms/${id}`, data);
    },
    deleteCommunityProgram(id) {
        return apiClient.delete(`/CommunityPrograms/${id}`);
    }
};

export default communityProgramService; 
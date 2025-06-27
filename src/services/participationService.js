import axios from 'axios';

const API_URL = '/api/Participation';

// User tham gia chương trình
export const joinProgram = (programId, token, preSurvey = '', postSurvey = '') =>
    axios.post(API_URL, { programId, preSurvey, postSurvey }, {
        headers: { Authorization: `Bearer ${token}` }
    });

// Lấy danh sách chương trình user đã tham gia
export const getMyParticipations = (token) =>
    axios.get(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });

// Admin: Lấy danh sách người tham gia của 1 chương trình
export const getParticipantsByProgram = (programId, token) =>
    axios.get(`${API_URL}/program/${programId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

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
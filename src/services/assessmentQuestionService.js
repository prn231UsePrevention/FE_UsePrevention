import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = '/api/assessmentquestion';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const assessmentQuestionService = {
  getQuestionsByAssessmentId(assessmentId) {
    return apiClient.get(`/assessment/${assessmentId}`);
  },

  createQuestion(questionData) {
    return apiClient.post('/', questionData);
  },

  updateQuestion(id, questionData) {
    return apiClient.put(`/${id}`, questionData);
  },

  deleteQuestion(id) {
    return apiClient.delete(`/${id}`);
  },
};

export default assessmentQuestionService;

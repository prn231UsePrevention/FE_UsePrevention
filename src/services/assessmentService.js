import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = '/api/assessment';

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
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const assessmentService = {
  getAllAssessments() {
    return apiClient.get();
  },

  getAssessmentById(id) {
    return apiClient.get(`/${id}`);
  },

  createAssessment(assessmentData) {
    return apiClient.post('/', assessmentData);
  },

  updateAssessment(id, assessmentData) {
    return apiClient.put(`/${id}`, assessmentData);
  },

  deleteAssessment(id) {
    return apiClient.delete(`/${id}`);
  },

  submitAssessment(submissionData) {
    // Kiểm tra xem có câu trả lời nào null không
    const hasInvalidAnswer = submissionData.answers.some(
      (ans) => ans.value === null || ans.value === ''
    );
    if (hasInvalidAnswer) {
      console.warn('❌ Một số câu hỏi chưa được trả lời.');
      return Promise.reject(new Error('Vui lòng trả lời tất cả các câu hỏi trước khi nộp.'));
    }

    console.log('✅ Sending submissionData:', submissionData);
    return apiClient.post('/submit', submissionData);
  },

  getQuestionsForAssessment(assessmentId) {
    return axios.get(`http://localhost:5153/api/assessmentquestion/assessment/${assessmentId}`, {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
    });
  },

  getResultById(resultId) {
    return apiClient.get(`/result/${resultId}`);
  },

  getUserAssessmentResults(userId) {
    return apiClient.get(`/results/user/${userId}`);
  },

  deleteAssessmentResult(resultId) {
    return apiClient.delete(`/result/${resultId}`);
  }
};

export default assessmentService;

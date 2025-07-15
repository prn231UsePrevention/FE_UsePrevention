import axios from 'axios'

const API_URL = 'https://localhost:7233/api/Enrollment'

export const enrollCourse = async (userId, courseId) => {
  const token = localStorage.getItem('token')
  const payload = {
    userId,
    courseId,
    progress: 0,
    enrollDate: new Date().toISOString()
  }
  const response = await axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
} 
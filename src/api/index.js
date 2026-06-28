import request from './client.js'

export function getQuestions(target = 'student') {
  return request(`/questions?target=${target}`)
}

export function submitQuiz(answers, preferredDuration, email) {
  const body = { answers, preferredDuration }
  if (email) body.email = email
  return request('/quiz/submit', { method: 'POST', body: JSON.stringify(body) })
}

export function getCareers() {
  return request('/careers')
}

export function getCareerStats(id) {
  return request(`/careers/${id}/stats`)
}

export function submitExperience(data) {
  return request('/experiences', { method: 'POST', body: JSON.stringify(data) })
}

export function sendChatMessage(message, history = []) {
  return request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) })
}

export function getAdminStats() {
  return request('/admin/stats')
}

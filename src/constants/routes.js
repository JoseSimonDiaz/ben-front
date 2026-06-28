export const ROUTES = Object.freeze({
  HOME: '/',
  QUIZ: '/test',
  RESULT: '/resultado',
  CHAT: '/chat',
  CAREERS: '/carreras',
  CAREER_DETAIL: '/carreras/:id',
  EXPERIENCE: '/experiencia',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_SETTINGS: '/admin/config',
})

export function careerDetail(id) {
  return `/carreras/${id}`
}

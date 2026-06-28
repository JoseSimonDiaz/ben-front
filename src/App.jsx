import { Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Landing from './pages/Landing.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import Chat from './pages/Chat.jsx'
import Careers from './pages/Careers.jsx'
import CareerDetail from './pages/CareerDetail.jsx'
import Experience from './pages/Experience.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <AdminProvider>
      <QuizProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="test" element={<Quiz />} />
            <Route path="resultado" element={<Result />} />
            <Route path="chat" element={<Chat />} />
            <Route path="carreras" element={<Careers />} />
            <Route path="carreras/:id" element={<CareerDetail />} />
            <Route path="experiencia" element={<Experience />} />
          </Route>
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </QuizProvider>
    </AdminProvider>
  )
}

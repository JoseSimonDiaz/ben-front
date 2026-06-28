import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import BottomNav from '../components/BottomNav.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Outlet />
      <Footer />
      <BottomNav />
    </div>
  )
}

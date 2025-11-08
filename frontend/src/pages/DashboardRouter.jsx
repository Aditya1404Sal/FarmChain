import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardRouter() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user) {
      navigate('/login')
      return
    }

    // Route based on user role
    switch (user.role) {
      case 'farmer':
        navigate('/dashboard/farmer')
        break
      case 'distributor':
        navigate('/dashboard/distributor')
        break
      case 'retailer':
      case 'manufacturer':
      case 'inspector':
      case 'admin':
        // For now, route to distributor dashboard (same functionality)
        navigate('/dashboard/distributor')
        break
      default:
        navigate('/login')
    }
  }, [navigate])

  return (
    <div className="container py-8 text-center">
      <p className="text-gray-600">Redirecting to your dashboard...</p>
    </div>
  )
}

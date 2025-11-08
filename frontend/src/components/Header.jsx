import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-semibold text-teal-600">
          🌾 FarmChain
        </Link>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-teal-600">
                Dashboard
              </Link>
              <Link to="/verify" className="text-gray-700 hover:text-teal-600">
                Verify Batch
              </Link>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/verify" className="text-gray-700 hover:text-teal-600">
                Verify Batch
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-teal-600">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1 px-3">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

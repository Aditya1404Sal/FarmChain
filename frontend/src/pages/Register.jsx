import { useState } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('farmer')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try{
      await authAPI.register({ name, email, password, role, phone, location })
      alert('Registration successful! Please login.')
      navigate('/login')
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input 
              required
              className="w-full border rounded px-3 py-2" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email"
              required
              className="w-full border rounded px-3 py-2" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input 
              type="password"
              required
              minLength="6"
              className="w-full border rounded px-3 py-2" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select 
              className="w-full border rounded px-3 py-2" 
              value={role} 
              onChange={e=>setRole(e.target.value)}
            >
              <option value="farmer">Farmer</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
              <option value="inspector">Inspector</option>
              <option value="manufacturer">Manufacturer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              type="tel"
              placeholder="10 digits"
              maxLength="10"
              className="w-full border rounded px-3 py-2" 
              value={phone} 
              onChange={e=>setPhone(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              placeholder="City, State"
              className="w-full border rounded px-3 py-2" 
              value={location} 
              onChange={e=>setLocation(e.target.value)} 
            />
          </div>
          <div>
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}

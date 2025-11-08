import { useState, useEffect } from 'react'
import { transactionAPI, batchAPI, userAPI } from '../services/api'

export default function TransactionForm({ batchId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    toAddress: '',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [batch, setBatch] = useState(null)
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadBatchDetails()
    loadUsers()
  }, [batchId])

  const loadBatchDetails = async () => {
    try {
      const data = await batchAPI.getById(batchId)
      setBatch(data)
    } catch (err) {
      setError('Failed to load batch details')
    }
  }

  const loadUsers = async () => {
    try {
      const data = await userAPI.list()
      // Filter out current user and show eligible recipients based on role
      const eligible = data.filter(u => {
        if (u.wallet_address === currentUser.wallet_address) return false
        
        // Farmers can transfer to distributors/manufacturers
        if (currentUser.role === 'farmer') {
          return ['distributor', 'manufacturer'].includes(u.role)
        }
        
        // Distributors can transfer to retailers/manufacturers
        if (currentUser.role === 'distributor') {
          return ['retailer', 'manufacturer'].includes(u.role)
        }
        
        // Manufacturers can transfer to distributors/retailers
        if (currentUser.role === 'manufacturer') {
          return ['distributor', 'retailer'].includes(u.role)
        }
        
        // Retailers are end consumers (no transfers)
        return false
      })
      setUsers(eligible)
    } catch (err) {
      setError('Failed to load users')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.toAddress) {
      setError('Please select a recipient')
      return
    }

    if (!formData.location) {
      setError('Location is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await transactionAPI.create({
        batchId,
        toAddress: formData.toAddress,
        location: formData.location,
        notes: formData.notes || ''
      })
      
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Transfer Batch</h2>
        
        {batch && (
          <div className="bg-gray-50 p-3 rounded mb-4">
            <p className="text-sm text-gray-600">Batch ID:</p>
            <p className="font-mono text-sm">{batch.batch_id}</p>
            <p className="text-sm text-gray-600 mt-1">Crop:</p>
            <p className="font-medium">{batch.crop_type} - {batch.quantity} {batch.unit}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Transfer To <span className="text-red-500">*</span>
            </label>
            <select
              name="toAddress"
              value={formData.toAddress}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select recipient...</option>
              {users.map(user => (
                <option key={user.wallet_address} value={user.wallet_address}>
                  {user.name} ({user.role}) - {user.location || 'No location'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {users.length === 0 ? 'No eligible recipients found' : `${users.length} eligible recipients`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter current location"
              required
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Location where the batch is currently stored
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this transfer..."
              rows="3"
              className="input"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading || users.length === 0}
            >
              {loading ? 'Processing...' : 'Transfer Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

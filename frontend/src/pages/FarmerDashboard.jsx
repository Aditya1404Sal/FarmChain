import { useState } from 'react'
import BatchForm from '../components/BatchForm'
import BatchList from '../components/BatchList'

export default function FarmerDashboard(){
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const user = JSON.parse(localStorage.getItem('user'))

  const handleBatchCreated = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1) // Trigger list refresh
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Farmer Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Create New Batch'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Create New Batch</h3>
          <BatchForm onSuccess={handleBatchCreated} />
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">My Batches</h3>
        <BatchList key={refreshKey} />
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import BatchList from '../components/BatchList'
import TransactionForm from '../components/TransactionForm'
import { batchAPI } from '../services/api'

export default function DistributorDashboard() {
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0
  })
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadStats()
  }, [refreshKey])

  const loadStats = async () => {
    try {
      const batches = await batchAPI.list()
      setStats({
        total: batches.length,
        inTransit: batches.filter(b => b.status === 'in_transit').length,
        delivered: batches.filter(b => b.status === 'delivered').length
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const handleTransferSuccess = () => {
    setSelectedBatchId(null)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              {user?.role === 'distributor' ? 'Distributor' : user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Dashboard
            </h2>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-blue-800">Total Batches</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-sm font-medium text-yellow-800">In Transit</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.inTransit}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-green-800">Delivered</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.delivered}</p>
        </div>
      </div>

      {/* Batch List with Transfer Functionality */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Available Batches</h3>
          <p className="text-sm text-gray-500">
            Click on any batch to view details or transfer
          </p>
        </div>
        <BatchList 
          key={refreshKey}
          onBatchSelect={setSelectedBatchId}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              const batch = prompt('Enter Batch ID to transfer:')
              if (batch) setSelectedBatchId(batch)
            }}
            className="btn-primary text-left p-4"
          >
            <div className="font-semibold">Transfer Batch</div>
            <div className="text-sm opacity-90">Transfer ownership to next party</div>
          </button>
          <button
            onClick={() => window.location.href = '/verify'}
            className="btn-secondary text-left p-4"
          >
            <div className="font-semibold">Verify Batch</div>
            <div className="text-sm">Check batch authenticity</div>
          </button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {selectedBatchId && (
        <TransactionForm
          batchId={selectedBatchId}
          onSuccess={handleTransferSuccess}
          onCancel={() => setSelectedBatchId(null)}
        />
      )}
    </div>
  )
}

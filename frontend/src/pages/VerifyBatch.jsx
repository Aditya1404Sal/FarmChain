import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { batchAPI, blockchainAPI } from '../services/api'

export default function VerifyBatch(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [batchId, setBatchId] = useState(id || '')
  const [batch, setBatch] = useState(null)
  const [blockchainData, setBlockchainData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      verifyBatch(id)
    }
  }, [id])

  const verifyBatch = async (searchId) => {
    setLoading(true)
    setError('')
    setBatch(null)
    setBlockchainData(null)

    try {
      // Fetch batch details
      const batchData = await batchAPI.getById(searchId)
      setBatch(batchData)

      // Verify on blockchain
      try {
        const bcData = await blockchainAPI.verifyBatch(searchId)
        setBlockchainData(bcData)
      } catch (err) {
        console.error('Blockchain verification failed:', err)
        setError('Batch found in database but not verified on blockchain')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Batch not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (batchId.trim()) {
      navigate(`/verify/${batchId.trim()}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Verify Batch Authenticity</h2>
        <p className="text-gray-600 mb-4">
          Enter a batch ID to verify its authenticity and view its complete supply chain history.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter Batch ID (e.g., FARM-2025-001)"
            className="input flex-1"
          />
          <button 
            type="submit" 
            disabled={loading || !batchId.trim()}
            className="btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {error && (
        <div className="card bg-red-50 border-2 border-red-200">
          <p className="text-red-800 font-medium">✗ {error}</p>
        </div>
      )}

      {batch && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-green-900">
                {blockchainData ? '✓ Verified on Blockchain' : '⚠ Database Only'}
              </h3>
              <p className="text-sm text-green-700">Batch ID: {batch.batch_id}</p>
            </div>
            <span className={`px-3 py-1 rounded ${
              batch.status === 'harvested' ? 'bg-green-100 text-green-800' :
              batch.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
              batch.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {batch.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-700">Crop Type:</span>
              <p className="font-medium text-gray-900">{batch.crop_type}</p>
            </div>
            <div>
              <span className="text-sm text-gray-700">Quantity:</span>
              <p className="font-medium text-gray-900">{batch.quantity} {batch.unit}</p>
            </div>
            <div>
              <span className="text-sm text-gray-700">Quality Grade:</span>
              <p className="font-medium text-gray-900">{batch.quality_grade}</p>
            </div>
            <div>
              <span className="text-sm text-gray-700">Harvest Date:</span>
              <p className="font-medium text-gray-900">{new Date(batch.harvest_date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-700">Farm Location:</span>
              <p className="font-medium text-gray-900">{batch.farm_location}</p>
            </div>
            <div>
              <span className="text-sm text-gray-700">Organic:</span>
              <p className="font-medium text-gray-900">{batch.organic_certified ? '✓ Certified' : 'No'}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/batch/${batch.batch_id}`)}
            className="btn-primary mt-4"
          >
            View Full Details & History
          </button>
        </div>
      )}

      {blockchainData && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Blockchain Data</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(blockchainData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

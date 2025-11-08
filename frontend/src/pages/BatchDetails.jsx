import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { batchAPI, transactionAPI, blockchainAPI } from '../services/api'
import { QRCodeSVG } from 'qrcode.react'
import TransactionForm from '../components/TransactionForm'

export default function BatchDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [batch, setBatch] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [blockchainVerified, setBlockchainVerified] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransferForm, setShowTransferForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    loadBatchDetails()
  }, [id])

  const loadBatchDetails = async () => {
    setLoading(true)
    setError('')
    try {
      // Load batch details
      const batchData = await batchAPI.getById(id)
      setBatch(batchData)

      // Load transaction history
      const txData = await transactionAPI.list(id)
      setTransactions(txData)

      // Verify on blockchain
      try {
        const verified = await blockchainAPI.verifyBatch(id)
        setBlockchainVerified(verified)
      } catch (err) {
        console.error('Blockchain verification failed:', err)
        setBlockchainVerified(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load batch details')
    } finally {
      setLoading(false)
    }
  }

  const handleTransferSuccess = () => {
    setShowTransferForm(false)
    loadBatchDetails() // Refresh data
  }

  const canTransfer = () => {
    if (!user || !batch) return false
    // User can transfer if they are the current owner
    return batch.current_owner === user.wallet_address
  }

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <p className="text-gray-600">Loading batch details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded">
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="container py-8 text-center">
        <p className="text-gray-600">Batch not found</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-800 mb-2">
              ← Back
            </button>
            <h2 className="text-2xl font-semibold">{batch.crop_type}</h2>
            <p className="text-sm text-gray-600 font-mono">{batch.batch_id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded ${
              batch.status === 'harvested' ? 'bg-green-100 text-green-800' :
              batch.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
              batch.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {batch.status}
            </span>
            {blockchainVerified !== null && (
              <span className={`px-3 py-1 rounded ${
                blockchainVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {blockchainVerified ? '✓ Verified' : '✗ Not Verified'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Information */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Batch Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Crop Type</span>
                <p className="font-medium">{batch.crop_type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Crop Variety</span>
                <p className="font-medium">{batch.crop_variety || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity</span>
                <p className="font-medium">{batch.quantity} {batch.unit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quality Grade</span>
                <p className="font-medium">{batch.quality_grade}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Harvest Date</span>
                <p className="font-medium">{new Date(batch.harvest_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Organic Certified</span>
                <p className="font-medium">{batch.organic_certified ? '✓ Yes' : 'No'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Farm Location</span>
                <p className="font-medium">{batch.farm_location}</p>
              </div>
              {batch.notes && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="font-medium">{batch.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <div key={tx.transaction_id} className="border-l-4 border-teal-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          Transfer #{transactions.length - index}
                        </p>
                        <p className="text-xs text-gray-600 font-mono mt-1">
                          {tx.from_address.slice(0, 10)}...{tx.from_address.slice(-8)} 
                          → 
                          {tx.to_address.slice(0, 10)}...{tx.to_address.slice(-8)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {tx.location}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-gray-600 mt-1">{tx.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="card text-center">
            <h3 className="text-lg font-semibold mb-4">QR Code</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={`${window.location.origin}/verify/${batch.batch_id}`}
                size={200}
                level="H"
              />
            </div>
            <p className="text-xs text-gray-500">
              Scan to verify batch authenticity
            </p>
          </div>

          {/* Actions */}
          {user && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                {canTransfer() && (
                  <button
                    onClick={() => setShowTransferForm(true)}
                    className="btn-primary w-full"
                  >
                    Transfer Ownership
                  </button>
                )}
                <button
                  onClick={() => navigate(`/verify/${batch.batch_id}`)}
                  className="btn-secondary w-full"
                >
                  Verify on Blockchain
                </button>
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Current Owner</h3>
            <p className="text-sm font-mono break-all">{batch.current_owner}</p>
            {canTransfer() && (
              <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
                You own this batch
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <TransactionForm
          batchId={batch.batch_id}
          onSuccess={handleTransferSuccess}
          onCancel={() => setShowTransferForm(false)}
        />
      )}
    </div>
  )
}

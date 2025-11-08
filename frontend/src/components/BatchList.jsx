import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { batchAPI } from '../services/api'

export default function BatchList({ userId, showAll = false }) {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadBatches()
  }, [])

  async function loadBatches() {
    try {
      const params = showAll ? {} : { farmerId: userId }
      const res = await batchAPI.list(params)
      setBatches(res.data?.data?.batches || res.data?.batches || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-4">Loading batches...</div>

  if (batches.length === 0) {
    return <div className="card text-center text-gray-500">No batches found</div>
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Batch ID</th>
            <th className="text-left py-2 px-3">Crop</th>
            <th className="text-left py-2 px-3">Quantity</th>
            <th className="text-left py-2 px-3">Grade</th>
            <th className="text-left py-2 px-3">Status</th>
            <th className="text-left py-2 px-3">Date</th>
            <th className="text-left py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.batch_id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3 font-mono text-sm">{batch.batch_id}</td>
              <td className="py-2 px-3">{batch.crop_type}</td>
              <td className="py-2 px-3">{batch.quantity} {batch.unit}</td>
              <td className="py-2 px-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  {batch.quality_grade}
                </span>
              </td>
              <td className="py-2 px-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                  {batch.status}
                </span>
              </td>
              <td className="py-2 px-3 text-sm">
                {new Date(batch.harvest_date).toLocaleDateString()}
              </td>
              <td className="py-2 px-3">
                <button
                  onClick={() => navigate(`/batch/${batch.batch_id}`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

export default function BatchCard({ batch }) {
  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/batch/${batch.batch_id}`)}
      className="card hover:shadow-lg cursor-pointer transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-mono text-sm text-gray-600">{batch.batch_id}</p>
          <h3 className="text-lg font-semibold">{batch.crop_type}</h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          batch.status === 'harvested' ? 'bg-green-100 text-green-800' :
          batch.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
          batch.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {batch.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Quantity:</span>
          <p className="font-medium">{batch.quantity} {batch.unit}</p>
        </div>
        <div>
          <span className="text-gray-600">Grade:</span>
          <p className="font-medium">{batch.quality_grade}</p>
        </div>
        <div>
          <span className="text-gray-600">Date:</span>
          <p className="font-medium">{new Date(batch.harvest_date).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-gray-600">Organic:</span>
          <p className="font-medium">{batch.organic_certified ? '✓ Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}

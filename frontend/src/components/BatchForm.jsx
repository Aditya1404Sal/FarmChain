import { useState } from 'react'
import { batchAPI } from '../services/api'
import { QRCodeSVG } from 'qrcode.react'

export default function BatchForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    cropType: '',
    cropVariety: '',
    quantity: '',
    unit: 'kg',
    qualityGrade: 'A',
    harvestDate: '',
    farmLocation: '',
    organicCertified: false,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdBatch, setCreatedBatch] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try{
      const batch = await batchAPI.create({
        cropType: formData.cropType,
        cropVariety: formData.cropVariety || null,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        qualityGrade: formData.qualityGrade,
        harvestDate: formData.harvestDate,
        farmLocation: formData.farmLocation,
        organicCertified: formData.organicCertified,
        notes: formData.notes || null
      })
      
      setCreatedBatch(batch)
      
      // Reset form
      setFormData({
        cropType: '',
        cropVariety: '',
        quantity: '',
        unit: 'kg',
        qualityGrade: 'A',
        harvestDate: '',
        farmLocation: '',
        organicCertified: false,
        notes: ''
      })
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000) // Give user time to see success message
      }
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create batch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {createdBatch && (
        <div className="bg-green-50 border-2 border-green-200 rounded p-4 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">✓ Batch Created Successfully!</h4>
          <p className="text-sm text-gray-700 mb-2">Batch ID: <span className="font-mono">{createdBatch.batch_id}</span></p>
          <div className="flex justify-center mt-3">
            <div className="bg-white p-3 rounded">
              <QRCodeSVG 
                value={`${window.location.origin}/verify/${createdBatch.batch_id}`}
                size={120}
                level="H"
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Scan this QR code to verify the batch</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Crop Type <span className="text-red-500">*</span>
            </label>
            <input 
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              placeholder="e.g., Wheat, Rice, Tomatoes"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Crop Variety</label>
            <input 
              name="cropVariety"
              value={formData.cropVariety}
              onChange={handleChange}
              placeholder="e.g., Basmati, Heirloom"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input 
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select 
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="tons">Tons</option>
              <option value="lbs">Pounds (lbs)</option>
              <option value="units">Units</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quality Grade <span className="text-red-500">*</span>
            </label>
            <select 
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Standard)</option>
              <option value="C">Grade C (Basic)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Harvest Date <span className="text-red-500">*</span>
            </label>
            <input 
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
              className="input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Farm Location <span className="text-red-500">*</span>
            </label>
            <input 
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleChange}
              placeholder="e.g., Farm Address, City, State"
              required
              className="input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                name="organicCertified"
                checked={formData.organicCertified}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Organic Certified</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information about the batch..."
              rows="3"
              className="input"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating Batch...' : 'Create Batch'}
        </button>
      </form>
    </div>
  )
}

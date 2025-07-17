import React from 'react'; 
import { useState } from "react"
import ApiService from "../Service/ApiService"
import "./DeleteModal.css"

const DeleteModal = ({ onClose, setError }) => {
  const [propertyId, setPropertyId] = useState("")
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const loadProperty = async () => {
    if (!propertyId.trim() || isNaN(Number(propertyId))) {
      setError("Please enter a valid numeric ID")
      return
    }
    try {
      setLoading(true)
      const response = await ApiService.getPropertyById(Number(propertyId))
      setProperty(response.data)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Property not found")
      } else {
        setError("An error occurred while loading the property")
      }
    } finally {
      setLoading(false)
    }

  }

  const handleDelete = async () => {
    if (!property) return

    if (window.confirm(`Are you sure you want to delete the property at ${property.id}?`)) {
      try {
        await ApiService.deleteProperty(property.id)
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Property not found or already deleted")
        } else {
          setError("Failed to delete property")
        }
      }

    }
  }

  if (success) {
    return (
      <div className="modal-overlay delete-modal">
        <div className="modal success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Property Deleted Successfully!</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay delete-modal">
      <div className="modal">
        <div className="modal-header">
          <h2>Delete Property</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {!property ? (
          <div className="id-search-section">
            <div className="search-input-group">
              <input
                type="number"
                placeholder="Enter Property ID"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
              />
              <button onClick={loadProperty} className="btn btn-primary" disabled={loading}>
                {loading ? "Loading..." : "Load Property"}
              </button>
            </div>
          </div>
        ) : (
          <div className="delete-confirmation">
            <div className="property-preview">
              <p>
                <strong>City:</strong> {property.City}
              </p>
              <p>
                <strong>Price:</strong> ${Number(property.Price).toLocaleString()}
              </p>
              <p>
                <strong>Type:</strong> {property.Property_Type} ({property.Listing_Type})
              </p>
            </div>
            <div className="delete-actions">
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Property
              </button>
              <button onClick={() => setProperty(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteModal

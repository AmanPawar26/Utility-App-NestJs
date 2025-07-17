import React from 'react';
import { useState } from "react"
import ApiService from "../Service/ApiService"
import "./UpdateModal.css"

const UpdateModal = ({ onClose, setError }) => {
  const [propertyId, setPropertyId] = useState("")
  const [property, setProperty] = useState(null)
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const loadProperty = async () => {
    if (!propertyId.trim()) return

    try {
      setLoading(true)
      const prop = await ApiService.getPropertyById(Number(propertyId))
      setProperty({...prop, id: Number(propertyId)})
      setFormData({
        City: prop.City || "",
        Address: prop.Address || "",
        ZipCode: prop.ZipCode || "",
        Property_Type: prop.Property_Type || "house",
        Price: prop.Price || "",
        Square_Feet: prop.Square_Feet || "",
        Beds: prop.Beds || "",
        Bathrooms: prop.Bathrooms || "",
        Features: prop.Features || "",
        Listing_Type: prop.Listing_Type || "sale",
      })
    } catch (err) {
      setError("Property not found")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["Square_Feet", "Beds", "Bathrooms"].includes(name)
        ? value === "" ? "" : Number(value)
        : value,
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!property || !formData) return

    try {
      console.log("Updating ID:", property.id, formData)
      await ApiService.updateProperty(property.id, formData)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError("Failed to update property")
    }
  }

  if (success) {
    return (
      <div className="modal-overlay update-modal">
        <div className="modal success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Property Updated Successfully!</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay update-modal">
      <div className="modal">
        <div className="modal-header">
          <h2>Update Property</h2>
          <button onClick={onClose} className="close-btn">×</button>
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
          <form onSubmit={handleUpdate} className="modal-form">
            <div className="form-row">
              <input
                type="text"
                name="City"
                placeholder="City *"
                value={formData.City}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="Address"
                placeholder="Address *"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="ZipCode"
                placeholder="Zip Code *"
                value={formData.ZipCode}
                onChange={handleChange}
                required
              />
              <div className="form-group">
                <label htmlFor="property-type">Property Type *</label>
                <select
                  id="property-type"
                  name="Property_Type"
                  value={formData.Property_Type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Property Type *</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <input
              type="text"
              name="Price"
              placeholder="Price *"
              value={formData.Price}
              onChange={handleChange}
              required
            />
            <div className="form-row">
              <input
                type="number"
                name="Square_Feet"
                placeholder="Square Feet *"
                value={formData.Square_Feet}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="Beds"
                placeholder="Bedrooms"
                value={formData.Beds}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                name="Bathrooms"
                placeholder="Bathrooms"
                value={formData.Bathrooms}
                onChange={handleChange}
                step="0.5"
              />
            <div className="form-group">
                <label htmlFor="listing-type">Listing Type *</label>
                <select
                  id="listing-type"
                  name="Listing_Type"
                  value={formData.Listing_Type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Listing Type *</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
            <textarea
              name="Features"
              placeholder="Features (optional)"
              value={formData.Features}
              onChange={handleChange}
              rows={3}
            />
            <button type="submit" className="btn btn-primary">Update Property</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UpdateModal

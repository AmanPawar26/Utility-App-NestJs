import { useState } from "react"
import ApiService from "../Service/ApiService"
import "./CreateModal.css"

const CreateModal = ({ onClose, setError }) => {
  const [formData, setFormData] = useState({
    City: "",
    Address: "",
    ZipCode: "",
    Property_Type: "house",
    Price: "",
    Square_Feet: "",
    Beds: "",
    Bathrooms: "",
    Features: "",
    Listing_Type: "sale",
  })

  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting formData", formData);
    
    try {
      await ApiService.createProperty(formData)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Backend Error:", error?.response?.data || error.message)
      setError("Failed to create property")
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

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="create-modal">
          <div className="modal success-modal">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>Property Created Successfully!</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="create-modal">
        <div className="modal">
          <div className="modal-header">
            <h2>Create New Property</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          <form onSubmit={handleSubmit} className="modal-form">
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
              <select name="Property_Type" value={formData.Property_Type} onChange={handleChange} required>
                <option value="" disabled>Select Property Type *</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="commercial">Commercial</option>
              </select>
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
              <select name="Listing_Type" value={formData.Listing_Type} onChange={handleChange} required>
                <option value="" disabled>Select Listing Type *</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <textarea
              name="Features"
              placeholder="Features (optional)"
              value={formData.Features}
              onChange={handleChange}
              rows={3}
            />
            <button type="submit" className="btn btn-primary">Create Property</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateModal

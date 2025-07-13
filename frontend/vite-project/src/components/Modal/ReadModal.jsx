import { useState } from "react"
import ApiService from "../Service/ApiService"
import "./ReadModal.css"

const ReadModal = ({ onClose, results, setResults, loading, setLoading, setError }) => {
  const [searchType, setSearchType] = useState(null)
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = async (type) => {
    try {
      setLoading(true)
      setError(null)

      if (type === "all") {
        const response = await ApiService.getAllProperties()
        console.log("All Properties", response.data)
        setResults(response.data)
        return
      }

      if (!searchValue.trim()) return

      if (type === "city") {
        const cityResults = await ApiService.getPropertiesByCity(searchValue)
        setResults(cityResults.data)
      } else if (type === "id") {
        const response = await ApiService.getPropertyById(Number(searchValue))
        setResults([response.data])
      }
    } catch (err) {
      setError(`Failed to search by ${type}`)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  if (!searchType && results.length === 0) {
    return (
      <div className="modal-overlay read-modal">
        <div className="modal">
          <div className="modal-header">
            <h2>Read Properties</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          <div className="read-options">
            <button className="btn btn-primary read-option-btn" onClick={() => setSearchType("city")}>
              Search by City
            </button>
            <button className="btn btn-primary read-option-btn" onClick={() => setSearchType("id")}>
              Search by ID
            </button>
            <button className="btn btn-primary read-option-btn" onClick={() => {
              setSearchType("all");
              handleSearch("all");
            }}>
              Get All Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay read-modal">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>
            {searchType === "city" && "Search by City"}
            {searchType === "id" && "Search by ID"}
            {searchType === null && results.length > 0 && "All Properties"}
          </h2>

          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="search-section">
          {searchType !== "all" && (
            <div className="search-input-group">
              <input
                type={searchType === "id" ? "number" : "text"}
                placeholder={searchType === "city" ? "Enter city name" : "Enter property ID"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button onClick={() => handleSearch(searchType)} className="btn btn-primary" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          )}
          <button onClick={() => {
            setSearchType(null);
            setResults([]);
          }} className="btn btn-secondary back-btn">
            ← Back to Options
          </button>
        </div>

        {results.length > 0 && (
          <div className="results-section">
            <h3>Results ({results.length})</h3>
            <div className="table-container">
              <table className="property-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Address</th>
                    <th>Zip Code</th>
                    <th>Property Type</th>
                    <th>Price</th>
                    <th>Sq Ft</th>
                    <th>Beds</th>
                    <th>Baths</th>
                    <th>Features</th>
                    <th>Listing Type</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((property) => (
                    <tr key={property.id ?? `${property.Address}-${property.City}`}>
                      <td>{property.City || "N/A"}</td>
                      <td>{property.Address || "N/A"}</td>
                      <td>{property.ZipCode || "N/A"}</td>
                      <td>{property.Property_Type || "N/A"}</td>
                      <td>{property.Price
                        ? `$${Number(property.Price.replace(/[^0-9.-]+/g, "")).toLocaleString()}`
                        : "N/A"}</td>
                      <td>{property.Square_Feet?.toLocaleString?.() || "N/A"}</td>
                      <td>{property.Beds ?? "N/A"}</td>
                      <td>{property.Bathrooms ?? "N/A"}</td>
                      <td>{property.Features || "N/A"}</td>
                      <td>{property.Listing_Type || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadModal

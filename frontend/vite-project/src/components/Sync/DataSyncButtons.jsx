
import { useState } from "react"
import ApiService from "../Service/ApiService"

const DataSyncButtons = ({ setError }) => {
  const [loadingFromSheets, setLoadingFromSheets] = useState(false)
  const [savingToSheets, setSavingToSheets] = useState(false)
  const [loadSuccess, setLoadSuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleLoadFromSheets = async () => {
    try {
      setLoadingFromSheets(true)
      setError(null)

      await ApiService.loadFromGoogleSheets()

      setLoadSuccess(true)
      setTimeout(() => setLoadSuccess(false), 3000)
    } catch (err) {
      setError("Failed to load data from Google Sheets")
      console.error("Error loading from sheets:", err)
    } finally {
      setLoadingFromSheets(false)
    }
  }

  const handleSaveToSheets = async () => {
    try {
      setSavingToSheets(true)
      setError(null)

      await ApiService.saveToGoogleSheets()

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError("Failed to save data to Google Sheets")
      console.error("Error saving to sheets:", err)
    } finally {
      setSavingToSheets(false)
    }
  }

  return (
    <div className="data-sync-container">
      <div className="sync-buttons">
        <button
          onClick={handleLoadFromSheets}
          disabled={loadingFromSheets}
          className={`btn sync-btn load-btn ${loadSuccess ? "success" : ""}`}
        >
          {loadingFromSheets ? (
            <>
              <span className="spinner"></span>
              Loading...
            </>
          ) : loadSuccess ? (
            <>✅ Loaded!</>
          ) : (
            <>📥 Load from Sheets</>
          )}
        </button>

        <button
          onClick={handleSaveToSheets}
          disabled={savingToSheets}
          className={`btn sync-btn save-btn ${saveSuccess ? "success" : ""}`}
        >
          {savingToSheets ? (
            <>
              <span className="spinner"></span>
              Saving...
            </>
          ) : saveSuccess ? (
            <>✅ Saved!</>
          ) : (
            <>📤 Save to Sheets</>
          )}
        </button>
      </div>

      <div className="sync-info">
        <p>
          <strong>Load:</strong> Import properties from Google Sheets to SQLite database
        </p>
        <p>
          <strong>Save:</strong> Export properties from SQLite database to Google Sheets
        </p>
      </div>
    </div>
  )
}

export default DataSyncButtons

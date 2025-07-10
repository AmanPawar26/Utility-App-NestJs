import React, { useState } from 'react'
import './Hero.css'
import DataSyncButtons from "../Sync/DataSyncButtons"

const Hero = () => {
    const [activeModal, setActiveModal] = useState(null)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleCloseModal = () => {
        setActiveModal(null)
        setResults([])
        setError(null)
    }
    return (
        <div className="app">
            <main className="main-content">
                 {/* Data Sync Section */}
                    <div className="sync-section">
                        <h2>Google Sheets Sync</h2>
                        <DataSyncButtons setError={setError} />
                    </div>
                <div className="crud-grid">
                    {/*CREATE Card */}
                    <div className="crud-card create-card" onClick={() => setActiveModal("create")}>
                        <div className="card-icon">➕</div>
                        <h2>CREATE</h2>
                        <p>Add a new Property</p>
                    </div>
                    {/*READ Card */}
                    <div className="crud-card read-card" onClick={() => setActiveModal("read")}>
                        <div className="card-icon">👁️</div>
                        <h2>READ</h2>
                        <p>Search properties by city or ID</p>
                    </div>
                    {/*UPDATE CARD */}
                    <div className="crud-card update-card" onClick={() => setActiveModal("update")}>
                        <div className="card-icon">✏️</div>
                        <h2>UPDATE</h2>
                        <p>Edit existing property</p>
                    </div>
                    {/*DELETE CARD */}
                    <div className="crud-card delete-card" onClick={() => setActiveModal("delete")}>
                        <div className="card-icon">🗑️</div>
                        <h2>DELETE</h2>
                        <p>Remove a property</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Hero
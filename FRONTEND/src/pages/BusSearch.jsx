import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusSearch = () => {
    const sources = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna','Cumilla','Bogura'];

    const destinationsMap = {
        Dhaka: ['Chittagong', 'Sylhet', 'Khulna'],
        Chittagong: ["Cox's Bazar"],
        Sylhet: ['Moulvibazar'],
        Khulna: ['Jessore'],
        Cumilla: ['Khulna','Bogura']
    };

    const [selectedSource, setSelectedSource] = useState('');
    const [selectedDest, setSelectedDest] = useState('');
    const [showConfirmBox, setShowConfirmBox] = useState(false);

    const navigate = useNavigate();

    const handleSourceChange = (e) => {
        setSelectedSource(e.target.value);
        setSelectedDest('');
        setShowConfirmBox(false);
    };

    const handleDestChange = (e) => {
        setSelectedDest(e.target.value);
        setShowConfirmBox(false);
    };

    const handleAddToBox = (e) => {
        e.preventDefault();

        if (selectedSource && selectedDest) {
            setShowConfirmBox(true);
        } else {
            alert("Please select both Source and Destination.");
        }
    };

    const handleConfirmRedirect = () => {
        navigate(
            `/trips?src=${encodeURIComponent(selectedSource)}&dst=${encodeURIComponent(selectedDest)}`
        );
    };

    return (
        <div className="search-page-background">
            <div className="search-wrapper">

               
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "12px"
                }}>
                    <button
                        onClick={() => navigate("/my-bookings")}
                        style={{
                            padding: "8px 14px",
                            backgroundColor: "#198754",
                            color: "black",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        View All Bookings
                    </button>
                </div>

                <div className="selection-form-container">
                    <h2>Find Your Journey</h2>
                    <p>Explore the world with Horizon Travels</p>

                    <form className="search-form" onSubmit={handleAddToBox}>
                        <div className="form-group">
                            <label>From</label>
                            <select value={selectedSource} onChange={handleSourceChange}>
                                <option value="">Select Source</option>
                                {sources.map((src, i) => (
                                    <option key={i} value={src}>{src}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>To</label>
                            <select
                                value={selectedDest}
                                onChange={handleDestChange}
                                disabled={!selectedSource}
                            >
                                <option value="">Select Destination</option>
                                {(destinationsMap[selectedSource] || []).map((dst, i) => (
                                    <option key={i} value={dst}>{dst}</option>
                                ))}
                            </select>
                        </div>

                        <button className="add-btn" type="submit">
                            Analyze Route
                        </button>
                    </form>
                </div>

                {showConfirmBox && (
                    <div className="confirmation-box">
                        <h3>Ready for Adventure?</h3>

                        <div className="route-display">
                            <span>{selectedSource}</span>
                            <span className="arrow">➔</span>
                            <span>{selectedDest}</span>
                        </div>

                        <p className="route-status">Congratulations...Route Available </p>

                        <button className="confirm-btn" onClick={handleConfirmRedirect}>
                            CONFIRM & SEARCH BUSES
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusSearch;

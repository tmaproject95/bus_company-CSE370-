import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusSearch = () => {
    const sources = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'];
    const destinationsMap = {
        Dhaka: ['Chittagong', 'Sylhet', 'Khulna'],
        Chittagong: ["Cox's Bazar"],
        Sylhet: ['Moulvibazar'],
        Khulna: ['Jessore']
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
        navigate(`/trips?src=${selectedSource}&dst=${selectedDest}`);
    };

    return (
        <div className="search-page-background">
            <div className="search-wrapper">

                <div className="selection-form-container">
                    <h2>Find Your Journey</h2>
                    <p>Explore the world with Horizon Travels</p>

                    <form className="search-form">
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

                        <button className="add-btn" onClick={handleAddToBox}>
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
                        <p className="route-status">Route Available ✅</p>
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
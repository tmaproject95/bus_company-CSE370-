import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Seats.css";

const SeatIcon = ({ status, onClick }) => {
    let fillColor = "#000000";
    if (status === "selected") fillColor = "#00ff00";
    if (status === "occupied") fillColor = "#ff0000";

    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            onClick={onClick}
            style={{ cursor: status === "occupied" ? "not-allowed" : "pointer" }}
        >

            <path
                d="M4 18v3h3v-3h10v3h3v-6a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v3zm2-8h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"
                fill={fillColor}
            />
        </svg>
    );
};

const Seats = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("tid");

    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);

    useEffect(() => {
        if(tripId) {
            axios.get(`http://localhost:5000/api/seats?tid=${tripId}`)
                .then(res => setSeats(res.data))
                .catch(err => console.error(err));
        }
    }, [tripId]);

    const handleSeatClick = (seatObj) => {
        if (seatObj.is_booked === 1) return; // Ignore occupied


        if (selectedSeat && selectedSeat.seat_id === seatObj.seat_id) {
            setSelectedSeat(null);
        } else {
            setSelectedSeat(seatObj);
        }
    };

    const handleConfirm = () => {
        if (!selectedSeat) return alert("Please select a seat first.");

        navigate("/initbookings", {
            state: {
                seat: selectedSeat.seat_number,
                seatId: selectedSeat.seat_id,
                tripId: tripId
            }
        });
    };

    return (
        <div className="seats-page-white">

            <div className="legend-container">
                <h3>Seat Legend:</h3>
                <div className="legend-items">
                    <div className="legend-item">
                        <SeatIcon status="available" /> <span>= Available</span>
                    </div>
                    <div className="legend-item">
                        <SeatIcon status="selected" /> <span>= Selected</span>
                    </div>
                    <div className="legend-item">
                        <SeatIcon status="occupied" /> <span>= Occupied</span>
                    </div>
                </div>
            </div>

            <div className="bus-container">

                <div className="driver-row">
                    <span role="img" aria-label="driver" style={{fontSize: '30px'}}>steering_wheel</span>
                    {/* Or use an SVG for steering wheel if preferred */}
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="black">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.05-1.09.14-1.62L9 15v1c0 1.1.9 2 2 2v-2h2v2c1.1 0 2-.9 2-2v-1l4.86-4.62C19.95 10.91 20 11.45 20 12c0 4.41-3.59 8-8 8zm5-9.41l-3.5 3.32C13.25 13.56 12.62 13 12 13c-.62 0-1.25.56-1.5 1.91L7 11.59C7 11.4 7 11.21 7 11c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .21 0 .4-.01.59z"/>
                    </svg>
                </div>

                <div className="seats-grid">
                    {seats.map((seat, index) => {
                        let status = "available";
                        if (seat.is_booked === 1) status = "occupied";
                        if (selectedSeat && selectedSeat.seat_id === seat.seat_id) status = "selected";

                        return (
                            <div key={seat.seat_id} className={`seat-wrapper ${index % 4 === 1 ? 'aisle-right' : ''}`}>
                                <SeatIcon
                                    status={status}
                                    onClick={() => handleSeatClick(seat)}
                                />

                            </div>
                        );
                    })}
                </div>
            </div>


            <div className="action-area">
                <button className="submit-btn-simple" onClick={handleConfirm}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Seats;
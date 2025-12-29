import React from "react";
import { useNavigate } from "react-router-dom";
import "./Seats.css";

const Seats = () => {
    const navigate = useNavigate();

    const rows = 8;
    const seatsPerSide = 2;

    const handleSeatClick = (seatId) => {
        navigate("/initbookings", { state: { seat: seatId } });
    };

    return (
        <div className="seats-page">
            <h2>Select Your Seat</h2>

            <div className="bus">
                {[...Array(rows)].map((_, rowIndex) => (
                    <div className="seat-row" key={rowIndex}>
                        <div className="seat-side">
                            {[...Array(seatsPerSide)].map((_, i) => {
                                const seatId = `${rowIndex + 1}A${i + 1}`;
                                return (
                                    <div
                                        key={seatId}
                                        className="seat available"
                                        onClick={() => handleSeatClick(seatId)}
                                    >
                                        {seatId}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="aisle"></div>

                        <div className="seat-side">
                            {[...Array(seatsPerSide)].map((_, i) => {
                                const seatId = `${rowIndex + 1}B${i + 1}`;
                                return (
                                    <div
                                        key={seatId}
                                        className="seat available"
                                        onClick={() => handleSeatClick(seatId)}
                                    >
                                        {seatId}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Seats;

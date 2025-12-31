import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeatsBooking.css";

const SeatsBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { seat, seatId, tripId } = location.state || {};

    const [bookingId, setBookingId] = useState(null);
    const [status, setStatus] = useState("initial"); // initial, pending, cancelled
    const [message, setMessage] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            alert("Please login first.");
            navigate("/login");
        }
        if (!seat || !tripId) {
            // Don't redirect immediately so they can read the error on screen
            setStatus("error");
        }
    }, [userId, seat, tripId, navigate]);

    // --- BACKEND INTERACTIONS ---

    // Matches your backend: createbooking (uid, tid, sid)
    const handleCreateBooking = async () => {
        if (!userId) return;

        try {
            setMessage("Holding seat...");
            const res = await axios.post("http://localhost:5000/api/initbooking/createbooking", {
                uid: parseInt(userId),
                tid: parseInt(tripId),
                sid: parseInt(seatId)
            });

            // If successful, backend returns { message, booking_id }
            if (res.status === 200) {
                setBookingId(res.data.booking_id);
                setStatus("pending");
                setMessage(res.data.message); // "Booking created as pending"
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data || "Failed to hold seat.");
        }
    };

    // Matches your backend: cancelbooking (bid, uid)
    const handleCancelBooking = async () => {
        if (!bookingId) return;

        try {
            setMessage("Cancelling...");
            const res = await axios.post("http://localhost:5000/api/initbooking/cancelbooking", {
                bid: bookingId,
                uid: parseInt(userId)
            });

            if (res.status === 200) {
                setStatus("cancelled");
                setMessage(res.data); // "Your Booking cancelled successfully..."
                setBookingId(null);

                // Optional: Redirect after short delay
                setTimeout(() => navigate("/search"), 2000);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data || "Cancellation failed");
        }
    };

    const handleProceedToPay = () => {
        alert("Payment Gateway - Coming Soon!");
    };

    // --- RENDER ---

    // Safety: If accessed directly without selecting a seat
    if (status === "error" || !seat) {
        return (
            <div className="booking-overlay">
                <div className="booking-card">
                    <h2>⚠️ Error</h2>
                    <p>No seat selected.</p>
                    <button className="btn-secondary" onClick={() => navigate("/search")}>Go to Search</button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-overlay">
            <div className="booking-card">
                <h2>Confirm Booking</h2>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Trip ID</label>
                        <span>{tripId}</span>
                    </div>
                    <div className="info-item">
                        <label>Seat</label>
                        <span className="highlight">{seat}</span>
                    </div>
                    <div className="info-item">
                        <label>Status</label>
                        <span className={`status-tag ${status}`}>
                            {status === "initial" ? "Not Booked" : status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="status-message">
                    {message}
                </div>

                <div className="action-buttons">
                    {/* STEP 1: CREATE BOOKING */}
                    {status === "initial" && (
                        <button className="btn-primary" onClick={handleCreateBooking}>
                            Confirm & Hold Seat
                        </button>
                    )}

                    {/* STEP 2: PAY OR CANCEL */}
                    {status === "pending" && (
                        <>
                            <button className="btn-success" onClick={handleProceedToPay}>
                                Proceed to Payment
                            </button>
                            <button className="btn-danger" onClick={handleCancelBooking}>
                                Cancel Booking
                            </button>
                        </>
                    )}

                    {/* STEP 3: CANCELLED */}
                    {status === "cancelled" && (
                        <button className="btn-secondary" onClick={() => navigate("/search")}>
                            Find Another Bus
                        </button>
                    )}

                    {/* ALWAYS SHOW BACK BUTTON IF NOT PENDING */}
                    {status === "initial" && (
                        <button className="btn-text" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatsBooking;
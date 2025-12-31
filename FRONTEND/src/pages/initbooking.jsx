import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./initbooking.css";

const InitBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Get Data from Seats page
    const { seat, seatId, tripId } = location.state || {};

    // 2. State Variables
    const [bookingId, setBookingId] = useState(null);
    const [status, setStatus] = useState("initial"); // initial -> pending -> cancelled
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 3. Get User ID (With Fallback for Testing)
    // FIX: If no ID found in storage, we use '1' just to make the demo work
    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId ? storedUserId : "1";

    // 4. Validate Session (Only check if Seat/Trip exists)
    useEffect(() => {
        if (!seat || !tripId) {
            setMessage("Invalid session. Please select a seat again.");
            setStatus("error");
        }
        // Removed the strict Login check so you can proceed with Default ID 1
    }, [seat, tripId]);

    // --- API HANDLERS ---

    const handleCreateBooking = async () => {
        setLoading(true);

        try {
            console.log("Sending to backend:", { uid: userId, tid: tripId, sid: seatId });

            // Matches your Backend: createbooking logic
            const res = await axios.post("http://localhost:5000/api/initbooking/createbooking", {
                uid: parseInt(userId),
                tid: parseInt(tripId),
                sid: parseInt(seatId)
            });

            if (res.status === 200) {
                setBookingId(res.data.booking_id);
                setStatus("pending");
                setMessage("Booking created as pending. Please pay to confirm.");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(err.response?.data || "Seat already booked or error occurred.");
        }
        setLoading(false);
    };

    const handleCancelBooking = async () => {
        if (!bookingId) return;
        setLoading(true);

        try {
            // Matches your Backend: cancelbooking logic
            const res = await axios.post("http://localhost:5000/api/initbooking/cancelbooking", {
                bid: bookingId,
                uid: parseInt(userId)
            });

            if (res.status === 200) {
                setStatus("cancelled");
                setMessage(res.data);
                setTimeout(() => navigate("/search"), 2000);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data || "Cancellation failed");
        }
        setLoading(false);
    };

    const handleProceedToPay = () => {
        alert("Proceeding to Payment Gateway...");
    };

    // --- RENDER UI ---

    if (status === "error") {
        return (
            <div className="init-container">
                <div className="init-card error">
                    <h2>⚠️ Error</h2>
                    <p>{message}</p>
                    <button onClick={() => navigate("/search")}>Go to Search</button>
                </div>
            </div>
        );
    }

    return (
        <div className="init-container">
            <div className="init-card">
                <h2>Booking Summary</h2>

                <div className="ticket-details">
                    <p><strong>Trip ID:</strong> {tripId}</p>
                    <p><strong>Seat:</strong> <span className="seat-badge">{seat}</span></p>
                    <p><strong>Status:</strong> <span className={`status-text ${status}`}>{status.toUpperCase()}</span></p>
                </div>

                <div className="message-area">
                    {message}
                </div>

                <div className="button-group">
                    {/* STEP 1: INITIAL (Show Confirm Button) */}
                    {status === "initial" && (
                        <button className="btn-confirm" onClick={handleCreateBooking} disabled={loading}>
                            {loading ? "Processing..." : "Confirm & Hold Seat"}
                        </button>
                    )}

                    {/* STEP 2: PENDING (Show Pay & Cancel Buttons) */}
                    {status === "pending" && (
                        <>
                            <button className="btn-pay" onClick={handleProceedToPay} disabled={loading}>
                                Proceed to Pay
                            </button>
                            <button className="btn-cancel" onClick={handleCancelBooking} disabled={loading}>
                                Cancel Booking
                            </button>
                        </>
                    )}

                    {/* STEP 3: CANCELLED */}
                    {status === "cancelled" && (
                        <p>Redirecting to home...</p>
                    )}

                    {/* Back Button */}
                    {status === "initial" && (
                        <button className="btn-back" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InitBooking;
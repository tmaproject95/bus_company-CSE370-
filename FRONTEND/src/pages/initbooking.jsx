import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./initbooking.css";

const InitBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { seat, seatId, tripId } = location.state || {};

    const [bookingId, setBookingId] = useState(null);
    const [status, setStatus] = useState("initial");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId ? storedUserId : "1";

    useEffect(() => {
        if (!seat || !seatId || !tripId) {
            setMessage("Invalid session. Please select a seat again.");
            setStatus("error");
        }
    }, [seat, seatId, tripId]);




    const handleCreateBooking = async () => {
        if (!seatId || !tripId) {
            setMessage("Seat or Trip information is missing.");
            setStatus("error");
            return;
        }

        setLoading(true);
        console.log("Booking Data Sent:", { uid: userId, tripId, seat, seatId });

        try {
            const res = await axios.post(
                "http://localhost:5000/api/initbooking/createbooking",
                {
                    uid: parseInt(userId),
                    tid: parseInt(tripId),
                    sid: parseInt(seatId)
                }
            );

            if (res.status === 200) {
                setBookingId(res.data.booking_id);
                setStatus("pending");
                setMessage("Booking created as pending. Please pay to confirm.");
            }
        } catch (err) {
            console.error("Create Booking Error:", err.response?.data || err.message);
            setStatus("error");
            setMessage(err.response?.data || "Seat already booked or error occurred.");
        }

        setLoading(false);
    };


    const handleCancelBooking = async () => {
        if (!bookingId) return;
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/initbooking/cancelbooking",
                {
                    bid: bookingId,
                    uid: parseInt(userId)
                }
            );

            if (res.status === 200) {
                setStatus("cancelled");
                setMessage(res.data);
                setTimeout(() => navigate("/search"), 2000);
            }
        } catch (err) {
            console.error("Cancel Booking Error:", err.response?.data || err.message);
            setMessage(err.response?.data || "Cancellation failed");
        }

        setLoading(false);
    };


    const handleProceedToPay = () => {
        if (!bookingId) {
            setMessage("Booking not created yet. Confirm your seat first.");
            return;
        }
        navigate(`/payment?booking_id=${bookingId}`);
    };



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
                    <p><strong>Trip ID:</strong> {tripId || "N/A"}</p>
                    <p>
                        <strong>Seat:</strong>{" "}
                        <span className="seat-badge">{seat || "N/A"}</span>
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-text ${status}`}>
                            {status.toUpperCase()}
                        </span>
                    </p>
                </div>

                <div className="message-area">{message}</div>

                <div className="button-group">
                  
                    {status === "initial" && (
                        <>
                            <button
                                className="btn-confirm"
                                onClick={handleCreateBooking}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Confirm & Hold Seat"}
                            </button>
                            <button className="btn-back" onClick={() => navigate(-1)}>
                                Go Back
                            </button>
                        </>
                    )}


                    {status === "pending" && (
                        <>
                            <button
                                className="btn-pay"
                                onClick={handleProceedToPay}
                                disabled={loading}
                            >
                                Proceed to Pay
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={handleCancelBooking}
                                disabled={loading}
                            >
                                Cancel Booking
                            </button>
                        </>
                    )}


                    {status === "cancelled" && <p>Redirecting to home...</p>}
                </div>
            </div>
        </div>
    );
};

export default InitBooking;
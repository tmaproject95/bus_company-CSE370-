import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const MyBookings = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        axios
            .get(`/initbooking/user/${userId}`)
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.post("/initbooking/cancelbooking", {
                bid: bookingId,
                uid: parseInt(userId)
            });

            setBookings(prev =>
                prev.map(b =>
                    b.booking_id === bookingId
                        ? { ...b, status: "cancelled" }
                        : b
                )
            );
        } catch {
            alert("Cancellation failed");
        }
    };

    if (loading) {
        return <p style={{ padding: "30px" }}>Loading bookings...</p>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h2 style={{ textAlign: "center" }}>📄 My Bookings</h2>

            {bookings.length === 0 && (
                <p style={{ textAlign: "center" }}>No bookings found.</p>
            )}

            {bookings.map(b => (
                <div
                    key={b.booking_id}
                    style={{
                        background: "#212529",
                        padding: "20px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                >
                    <p><strong>Booking ID:</strong> {b.booking_id}</p>
                    <p><strong>Route:</strong> {b.source} → {b.destination}</p>
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Time:</strong> {b.departure_time}</p>
                    <p><strong>Bus:</strong> {b.bus_number}</p>
                    <p><strong>Seat:</strong> {b.seat_number}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                                color:
                                    b.status === "confirmed"
                                        ? "green"
                                        : b.status === "cancelled"
                                            ? "red"
                                            : "orange",
                                fontWeight: "bold"
                            }}
                        >
                            {b.status.toUpperCase()}
                        </span>
                    </p>


                    <div style={{ marginTop: "10px" }}>
                        {b.status === "pending" && (
                            <>
                                <button
                                    onClick={() =>
                                        navigate(`/payment?booking_id=${b.booking_id}`)
                                    }
                                    style={{
                                        marginRight: "10px",
                                        padding: "6px 12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Proceed to Pay
                                </button>

                                <button
                                    onClick={() => handleCancel(b.booking_id)}
                                    style={{
                                        padding: "6px 12px",
                                        cursor: "pointer",
                                        background: "#dc3545",
                                        color: "#fff",
                                        border: "none"
                                    }}
                                >
                                    Cancel Booking
                                </button>
                            </>
                        )}

                        {b.status === "confirmed" && (
                            <button
                                onClick={() =>
                                    navigate(`/ticket?booking_id=${b.booking_id}`)
                                }
                                style={{
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    background: "#28a745",
                                    color: "#fff",
                                    border: "none"
                                }}
                            >
                                Download Ticket
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button onClick={() => navigate("/search")}>
                    Back to Search
                </button>
            </div>
        </div>
    );
};

export default MyBookings;

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Payment = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const bookingId = params.get("booking_id");
    const userId = localStorage.getItem("userId");

    const [method, setMethod] = useState("");
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!bookingId) return;

        axios.get(`/payment/booking/${bookingId}`)
            .then(res => {
                setAmount(res.data.fare);
            })
            .catch(() => {});
    }, [bookingId]);

    const handlePayment = () => {
        if (!method) {
            alert("Select a payment method");
            return;
        }

        setLoading(true);

        axios.post("/payment/pay", {
            booking_id: bookingId,
            user_id: userId,
            method
        })
            .then(() => {
                navigate(`/ticket?booking_id=${bookingId}`);
            })
            .catch(() => {
                alert("Payment failed");
                setLoading(false);
            });
    };

    return (
        <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
            <h2>Payment</h2>

            <p><strong>Amount:</strong> ৳ {amount}</p>

            <div style={{ marginTop: "20px" }}>
                <label>
                    <input
                        type="radio"
                        value="bkash"
                        checked={method === "bkash"}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    bKash
                </label>
                <br />

                <label>
                    <input
                        type="radio"
                        value="nagad"
                        checked={method === "nagad"}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    Nagad
                </label>
                <br />

                <label>
                    <input
                        type="radio"
                        value="card"
                        checked={method === "card"}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    Card
                </label>
            </div>

            <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                    marginTop: "30px",
                    padding: "10px 20px",
                    cursor: "pointer"
                }}
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default Payment;

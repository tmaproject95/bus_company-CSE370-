import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";

const Ticket = () => {
    const [params] = useSearchParams();
    const bookingId = params.get("booking_id");

    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        if (!bookingId) return;

        axios.get(`/payment/ticket/${bookingId}`)
            .then(res => setTicket(res.data))
            .catch(err => console.error("Failed to fetch ticket:", err));
    }, [bookingId]);

    const handleDownload = () => {
        if (!ticket) return;


        const content = `
🎫 HORIZON TRAVELS - Bus Ticket

Passenger Name: ${ticket.name}
User ID: ${ticket.user_id}
Booking ID: ${ticket.booking_id}
Bus Number: ${ticket.bus_number}
Seat Number: ${ticket.seat_number}
Route: ${ticket.source} → ${ticket.destination}
Date: ${ticket.date}
Time: ${ticket.departure_time}
Fare: ৳ ${ticket.fare}
Status: Paid

Thank you for booking with us!
        `;

    
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);


        const link = document.createElement("a");
        link.href = url;
        link.download = `Ticket_${ticket.booking_id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


        URL.revokeObjectURL(url);
    };

    if (!ticket)
  return (
    <p
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "26px",
        fontWeight: "600",
        color: "#2e7d32",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        textAlign: "center",
        letterSpacing: "0.5px",
      }}
    >
      Yaayyyyy....Booking created successfully <br />
      Happy Journey!!! 
    </p>
  );


    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
            <h2>🎫 Bus Ticket</h2>

            <p><strong>Passenger:</strong> {ticket.name}</p>
            <p><strong>Bus:</strong> {ticket.bus_number}</p>
            <p><strong>Seat:</strong> {ticket.seat_number}</p>
            <p><strong>Route:</strong> {ticket.source} → {ticket.destination}</p>
            <p><strong>Date:</strong> {ticket.date}</p>
            <p><strong>Time:</strong> {ticket.departure_time}</p>
            <p><strong>Fare:</strong> ৳ {ticket.fare}</p>
            <p><strong>Status:</strong> Paid</p>

            <button
                onClick={handleDownload}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    cursor: "pointer"
                }}
            >
                Download Ticket
            </button>
        </div>
    );
};

export default Ticket;
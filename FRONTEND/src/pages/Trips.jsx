import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../App.css";

const Trips = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const src = searchParams.get('src');
    const dst = searchParams.get('dst');

    const [routes, setRoutes] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (src && dst) {
            fetch(`/api/routes?src=${src}&dst=${dst}`)
                .then(res => res.json())
                .then(data => setRoutes(data))
                .catch(err => console.error("Error fetching routes:", err));
        }
    }, [src, dst]);

    useEffect(() => {
        if (selectedTrip) {
            fetch(`/api/seats?tid=${selectedTrip.trip_id}`)
                .then(res => res.json())
                .then(data => setSeats(data))
                .catch(err => console.error("Error fetching seats:", err));
        }
    }, [selectedTrip]);

    const handleTripSelect = (e) => {
        const tripId = e.target.value;
        const trip = routes.find(r => r.trip_id.toString() === tripId);
        setSelectedTrip(trip);
        setSelectedSeats([]);
    };

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    return (
        <div className="trips-bg">
            <div className="trips-wrapper">
                <div className="trip-list">
                    <h2>Select a Bus</h2>
                    <select className="trip-dropdown" onChange={handleTripSelect} defaultValue="">
                        <option value="" disabled>Select a Trip</option>
                        {routes.map(route => (
                            <option key={route.trip_id} value={route.trip_id}>
                                {route.bus_number} — {route.departure_time} — ৳{route.fare}
                            </option>
                        ))}
                    </select>

                    {selectedTrip && (
                        <div className="trip-card active">
                            <p><strong>Bus Number:</strong> {selectedTrip.bus_number}</p>
                            <p><strong>Type:</strong> {selectedTrip.bus_type}</p>
                            <p><strong>Departure:</strong> {selectedTrip.departure_time}</p>
                            <p><strong>Fare:</strong> ৳{selectedTrip.fare}</p>
                        </div>
                    )}
                </div>

                {selectedTrip && (
                    <div className="seat-panel">
                        <h2>Select Seats</h2>
                        <div className="seats-grid">
                            {seats.map(seat => (
                                <div
                                    key={seat.seat_id}
                                    className={`seat ${seat.is_booked ? 'unavailable' : selectedSeats.includes(seat.seat_id) ? 'selected' : 'available'}`}
                                    onClick={() => !seat.is_booked && toggleSeat(seat.seat_id)}
                                    title={`Seat ${seat.seat_number} - ${seat.seat_type}`}
                                >
                                    {seat.seat_number}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trips;

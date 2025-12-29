import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Trips.css";

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const src = params.get("src");
    const dst = params.get("dst");

    useEffect(() => {
        if (!src || !dst) return;

        fetch(`http://localhost:5000/api/routes?src=${src}&dst=${dst}`)
            .then(res => res.json())
            .then(data => setTrips(data))
            .catch(err => console.error(err));
    }, [src, dst]);

    return (
        <div className="trips-container">
            <h2 className="title">Available Buses</h2>

            {trips.length === 0 && (
                <p style={{ color: "white", textAlign: "center" }}>
                    No buses available
                </p>
            )}

            {trips.map((t) => (
                <div className="trip-card" key={t.trip_id}>
                    <h3>{t.bus_number} ({t.bus_type})</h3>
                    <p>Date: {t.date}</p>
                    <p>Time: {t.departure_time} - {t.arrival_time}</p>
                    <p>Fare: ৳{t.fare}</p>

                    <button
                        onClick={() => navigate(`/seats?tid=${t.trip_id}`)}
                    >
                        View Seats
                    </button>
                </div>
            ))}
        </div>
    );
}

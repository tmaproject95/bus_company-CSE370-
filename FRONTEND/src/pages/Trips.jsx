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
            .then(data => {
                console.log("Trips data:", data);
                setTrips(data);
            })
            .catch(err => console.error(err));
    }, [src, dst]);

    return (
        <div className="trips-container">
            <h2 className="title">Available Buses</h2>

            {trips.length === 0 && (
                <div style={{ textAlign: "center", color: "white", marginTop: "50px" }}>
                    <h3>No buses available</h3>
                    <p>Check if your database has trips scheduled for today or future dates.</p>
                </div>
            )}

            {trips.map((t) => (
                <div className="trip-card" key={t.trip_id}>
                    <div className="trip-info">
                        <h3>
                            {t.bus_number}
                            <span className="bus-type"> ({t.bus_type})</span>
                        </h3>
                        <div className="trip-route">
                            <p>{t.source} ➝ {t.destination}</p>
                        </div>
                    </div>

                    <div className="trip-details">
                        <p>📅 {t.date}</p>
                        <p>⏰ {t.departure_time} - {t.arrival_time}</p>
                        <p className="fare">৳ {t.fare}</p>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            className="view-seats-btn"
                            onClick={() => navigate(`/seats?tid=${t.trip_id}`)}
                        >
                            View Seats
                        </button>

                        {/* FEATURE 8: LIVE LOCATION */}
                        <button
                            className="view-seats-btn"
                            style={{ backgroundColor: "#0984e3" }}
                            onClick={() => navigate(`/live-location?tid=${t.trip_id}`)}
                        >
                            Track Bus
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

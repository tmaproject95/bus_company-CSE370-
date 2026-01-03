import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";

const LiveLocation = () => {
    const [params] = useSearchParams();
    const tripId = params.get("tid");

    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!tripId) return;

        const interval = setInterval(() => {
            axios.get(`/system/location/${tripId}`)
                .then(res => setLocation(res.data))
                .catch(() => {});
        }, 5000);

        return () => clearInterval(interval);
    }, [tripId]);

    return (
        <div style={{ padding: "30px" }}>
            <h2>Live Bus Location</h2>

            {!location && <p>Waiting for live location...</p>}

            {location && (
                <>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                    <p>Last Updated: {new Date(location.updated_at).toLocaleTimeString()}</p>
                </>
            )}
        </div>
    );
};

export default LiveLocation;

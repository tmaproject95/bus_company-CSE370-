import { useState } from "react";
import axios from "../api/axios";
import "./admin.css";

const Admin = () => {
    const [vehicle, setVehicle] = useState({ bus_number: "", type: "", total_seats: "" });
    const [route, setRoute] = useState({ source: "", destination: "", distance: "", estimated_duration: "" });
    const [trip, setTrip] = useState({ route_id: "", vehicle_id: "", date: "", departure_time: "", arrival_time: "", fare: "" });
    const [fareUpdate, setFareUpdate] = useState({ trip_id: "", fare: "" });
    const [statusUpdate, setStatusUpdate] = useState({ trip_id: "", trip_status: "" });

    const handleChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/admin/vehicle", {
                ...vehicle,
                total_seats: Number(vehicle.total_seats)
            });
            alert(res.data.message);
            setVehicle({ bus_number: "", type: "", total_seats: "" });
        } catch (err) {
            alert(err.response?.data || "Error adding vehicle");
        }
    };

    const handleRouteSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/admin/route", route);
            alert(res.data.message);
            setRoute({ source: "", destination: "", distance: "", estimated_duration: "" });
        } catch (err) {
            alert(err.response?.data || "Error creating route");
        }
    };

    const handleTripSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/admin/trip", trip);
            alert(res.data.message);
            setTrip({ route_id: "", vehicle_id: "", date: "", departure_time: "", arrival_time: "", fare: "" });
        } catch (err) {
            alert(err.response?.data || "Error scheduling trip");
        }
    };

    const handleFareUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("/admin/trip/fare", { ...fareUpdate, fare: Number(fareUpdate.fare) });
            alert(res.data);
            setFareUpdate({ trip_id: "", fare: "" });
        } catch (err) {
            alert(err.response?.data || "Error updating fare");
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("/admin/trip/status", statusUpdate);
            alert(res.data);
            setStatusUpdate({ trip_id: "", trip_status: "" });
        } catch (err) {
            alert(err.response?.data || "Error updating status");
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <section className="admin-section">
                <h2>Add Vehicle</h2>
                <form onSubmit={handleVehicleSubmit}>
                    <input name="bus_number" placeholder="Bus Number" value={vehicle.bus_number} onChange={handleChange(setVehicle)} required />
                    <input name="type" placeholder="Type (AC/Non-AC)" value={vehicle.type} onChange={handleChange(setVehicle)} required />
                    <input name="total_seats" type="number" placeholder="Total Seats" value={vehicle.total_seats} onChange={handleChange(setVehicle)} required />
                    <button type="submit">Add Vehicle</button>
                </form>
            </section>

            <section className="admin-section">
                <h2>Create Route</h2>
                <form onSubmit={handleRouteSubmit}>
                    <input name="source" placeholder="Source" value={route.source} onChange={handleChange(setRoute)} required />
                    <input name="destination" placeholder="Destination" value={route.destination} onChange={handleChange(setRoute)} required />
                    <input name="distance" placeholder="Distance" value={route.distance} onChange={handleChange(setRoute)} required />
                    <input name="estimated_duration" placeholder="Duration" value={route.estimated_duration} onChange={handleChange(setRoute)} required />
                    <button type="submit">Create Route</button>
                </form>
            </section>

            <section className="admin-section">
                <h2>Schedule Trip</h2>
                <form onSubmit={handleTripSubmit}>
                    <input name="route_id" placeholder="Route ID" value={trip.route_id} onChange={handleChange(setTrip)} required />
                    <input name="vehicle_id" placeholder="Vehicle ID" value={trip.vehicle_id} onChange={handleChange(setTrip)} required />
                    <input name="date" type="date" value={trip.date} onChange={handleChange(setTrip)} required />
                    <input name="departure_time" type="time" value={trip.departure_time} onChange={handleChange(setTrip)} required />
                    <input name="arrival_time" type="time" value={trip.arrival_time} onChange={handleChange(setTrip)} required />
                    <input name="fare" type="number" placeholder="Fare" value={trip.fare} onChange={handleChange(setTrip)} required />
                    <button type="submit">Schedule Trip</button>
                </form>
            </section>

            <section className="admin-section">
                <h2>Update Fare</h2>
                <form onSubmit={handleFareUpdate}>
                    <input name="trip_id" placeholder="Trip ID" value={fareUpdate.trip_id} onChange={handleChange(setFareUpdate)} required />
                    <input name="fare" type="number" placeholder="New Fare" value={fareUpdate.fare} onChange={handleChange(setFareUpdate)} required />
                    <button type="submit">Update Fare</button>
                </form>
            </section>

            <section className="admin-section">
                <h2>Update Trip Status</h2>
                <form onSubmit={handleStatusUpdate}>
                    <input name="trip_id" placeholder="Trip ID" value={statusUpdate.trip_id} onChange={handleChange(setStatusUpdate)} required />
                    <input name="trip_status" placeholder="Status (scheduled/cancelled/delay)" value={statusUpdate.trip_status} onChange={handleChange(setStatusUpdate)} required />
                    <button type="submit">Update Status</button>
                </form>
            </section>
        </div>
    );
};

export default Admin;

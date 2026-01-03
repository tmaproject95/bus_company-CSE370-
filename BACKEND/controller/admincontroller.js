import pool from "../db.js";

/*
   FEATURE 4: VEHICLE & SEAT CONFIGURATION (ADMIN)
 */


export const addVehicle = (req, res) => {
    const { bus_number, type, total_seats } = req.body;

    if (!bus_number || !type || !total_seats) {
        return res.status(400).send("Missing vehicle information");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
      INSERT INTO Vehicles (bus_number, type, total_seats)
      VALUES (?, ?, ?)
    `;

        connection.query(q, [bus_number, type, total_seats], (err, result) => {
            connection.release();
            if (err) return res.status(500).send("Failed to add vehicle");

            res.status(201).json({
                message: "Vehicle added successfully",
                vehicle_id: result.insertId
            });
        });
    });
};

export const generateSeats = (req, res) => {
    const { vehicle_id, total_seats } = req.body;

    if (!vehicle_id || !total_seats) {
        return res.status(400).send("Missing seat information");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        let values = [];
        for (let i = 1; i <= total_seats; i++) {
            values.push([i, "regular", vehicle_id]);
        }

        const q = `
      INSERT INTO Seats (seat_number, seat_type, vehicle_id)
      VALUES ?
    `;

        connection.query(q, [values], (err) => {
            connection.release();
            if (err) return res.status(500).send("Seat generation failed");

            res.status(201).send("Seats generated successfully");
        });
    });
};

/*
   FEATURE 5: ROUTE & TRIP SCHEDULING (ADMIN)
*/


export const createRoute = (req, res) => {
    const { source, destination, distance, estimated_duration } = req.body;

    if (!source || !destination || !distance || !estimated_duration) {
        return res.status(400).send("Missing route information");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
      INSERT INTO Routes (source, destination, distance, estimated_duration)
      VALUES (?, ?, ?, ?)
    `;

        connection.query(q, [source, destination, distance, estimated_duration], (err, result) => {
            connection.release();
            if (err) return res.status(500).send("Failed to create route");

            res.status(201).json({
                message: "Route created",
                route_id: result.insertId
            });
        });
    });
};


export const createTrip = (req, res) => {
    const { route_id, vehicle_id, date, departure_time, arrival_time, fare } = req.body;

    if (!route_id || !vehicle_id || !date || !departure_time || !arrival_time || !fare) {
        return res.status(400).send("Missing trip information");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
      INSERT INTO Trips
      (route_id, vehicle_id, date, departure_time, arrival_time, fare, trip_status)
      VALUES (?, ?, ?, ?, ?, ?, 'scheduled')
    `;

        connection.query(
            q,
            [route_id, vehicle_id, date, departure_time, arrival_time, fare],
            (err, result) => {
                connection.release();
                if (err) return res.status(500).send("Failed to create trip");

                res.status(201).json({
                    message: "Trip scheduled successfully",
                    trip_id: result.insertId
                });
            }
        );
    });
};

/*
   FEATURE 6: FARE & TRIP STATUS MANAGEMENT (ADMIN)
 */

export const updateTripFare = (req, res) => {
    const { trip_id, fare } = req.body;

    if (!trip_id || !fare) {
        return res.status(400).send("Missing fare info");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = "UPDATE Trips SET fare = ? WHERE trip_id = ?";

        connection.query(q, [fare, trip_id], (err) => {
            connection.release();
            if (err) return res.status(500).send("Failed to update fare");

            res.status(200).send("Fare updated successfully");
        });
    });
};





export const updateTripStatus = (req, res) => {
    const { trip_id, trip_status } = req.body;

    if (!trip_id || !trip_status) {
        return res.status(400).send("Missing status info");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q1 = "UPDATE Trips SET trip_status = ? WHERE trip_id = ?";
        const q2 = "UPDATE Bookings SET status = 'cancelled' WHERE trip_id = ?";

        connection.query(q1, [trip_status, trip_id], (err) => {
            if (err) {
                connection.release();
                return res.status(500).send("Trip status update failed");
            }

            if (trip_status === "cancelled") {
                connection.query(q2, [trip_id], () => {

                    /* teammate 3s code */
                    const nq = `
                        INSERT INTO Notifications (user_id, trip_id, message, type)
                        SELECT user_id, ?, ?, 'delay'
                        FROM Bookings
                        WHERE trip_id = ?
                    `;
                    connection.query(
                        nq,
                        [trip_id, "Your trip has been cancelled by admin.", trip_id]
                    );
                    /* teammate 3s code */

                    connection.release();
                    res.status(200).send("Trip cancelled and bookings updated");
                });
            } else {
                connection.release();
                res.status(200).send("Trip status updated");
            }
        });
    });
};


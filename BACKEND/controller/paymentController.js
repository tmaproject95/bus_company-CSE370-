import pool from "../db.js";


export const makePayment = (req, res) => {
    const { booking_id, user_id, method } = req.body;

    if (!booking_id || !user_id || !method) {
        return res.status(400).json({ message: "Missing payment data" });
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: "DB error" });

      
        const bookingQuery = `
            SELECT b.status, t.fare
            FROM Bookings b
            JOIN Trips t ON b.trip_id = t.trip_id
            WHERE b.booking_id = ? AND b.user_id = ?
        `;

        connection.query(bookingQuery, [booking_id, user_id], (err, result) => {
            if (err || result.length === 0) {
                connection.release();
                return res.status(400).json({ message: "Invalid booking" });
            }

            if (result[0].status !== "pending") {
                connection.release();
                return res.status(400).json({ message: "Booking already paid or cancelled" });
            }

            const amount = result[0].fare;


            const paymentQuery = `
                INSERT INTO Payments (booking_id, user_id, amount, method)
                VALUES (?, ?, ?, ?)
            `;

            connection.query(paymentQuery, [booking_id, user_id, amount, method], (err) => {
                if (err) {
                    connection.release();
                    return res.status(500).json({ message: "Payment failed" });
                }


                const updateBooking = `
                    UPDATE Bookings SET status = 'confirmed'
                    WHERE booking_id = ?
                `;

                connection.query(updateBooking, [booking_id], (err) => {
                    if (err) {
                        connection.release();
                        return res.status(500).json({ message: "Booking update failed" });
                    }


                    const notifyQuery = `
                        INSERT INTO Notifications (user_id, message, type)
                        VALUES (?, 'Payment successful. Booking confirmed.', 'payment')
                    `;

                    connection.query(notifyQuery, [user_id], () => {
                        connection.release();
                        res.json({ message: "Payment successful" });
                    });
                });
            });
        });
    });
};


export const getBookingDetails = (req, res) => {
    const { booking_id } = req.params;

    const query = `
        SELECT 
            b.booking_id, b.status, b.booking_time,
            t.date, t.departure_time, t.arrival_time, t.fare,
            r.source, r.destination,
            s.seat_number,
            v.bus_number
        FROM Bookings b
        JOIN Trips t ON b.trip_id = t.trip_id
        JOIN Routes r ON t.route_id = r.route_id
        JOIN Seats s ON b.seat_id = s.seat_id
        JOIN Vehicles v ON t.vehicle_id = v.vehicle_id
        WHERE b.booking_id = ?
    `;

    pool.query(query, [booking_id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(result[0]);
    });
};


export const getUserBookings = (req, res) => {
    const { user_id } = req.params;

    const query = `
        SELECT 
            b.booking_id, b.status,
            t.date, t.departure_time, t.arrival_time,
            r.source, r.destination,
            s.seat_number,
            t.fare
        FROM Bookings b
        JOIN Trips t ON b.trip_id = t.trip_id
        JOIN Routes r ON t.route_id = r.route_id
        JOIN Seats s ON b.seat_id = s.seat_id
        WHERE b.user_id = ?
        ORDER BY b.booking_time DESC
    `;

    pool.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json(result);
    });
};
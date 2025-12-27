import pool from "../db.js";

export const createbooking = (req, res) => {
    const { uid, tid, sid } = req.body;
    if (!uid || !tid || !sid) {
        return res.status(400).send("Missing required information.");
    }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send("Something went wrong.");
        }

        const checkSeatQuery =
            "SELECT booking_id FROM Bookings WHERE trip_id = ? AND seat_id = ? AND status IN ('pending','confirmed')";

        connection.query(checkSeatQuery, [tid, sid], (err, result) => {
            if (err) {
                connection.release();
                return res.status(500).send("Something went wrong.");
            }

            if (result.length > 0) {
                connection.release();
                return res.status(400).send("Seat already booked.");
            }

            const insertQuery =
                "INSERT INTO Bookings (user_id, trip_id, seat_id, status) VALUES (?, ?, ?, 'pending')";

            connection.query(insertQuery, [uid, tid, sid], (err, result) => {
                connection.release();
                if (err) {
                    return res.status(500).send("Something went wrong.");
                }
                return res.status(200).json({
                    message: "Booking created as pending",
                    booking_id: result.insertId
                });
            });
        });
    });
};

export const cancelbooking = (req, res) => {
    const { bid, uid } = req.body;

    if (!bid || !uid) {
        return res.status(400).send("Missing required fields");
    }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send("Something went wrong");
        }

        const q1 = "SELECT status FROM Bookings WHERE booking_id = ? AND user_id = ?";

        connection.query(q1, [bid, uid], (err, result) => {
            if (err) {
                connection.release();
                return res.status(500).send("Something went wrong");
            }

            if (result.length === 0) {
                connection.release();
                return res.status(404).send("Booking not found");
            }

            if (result[0].status === "cancelled") {
                connection.release();
                return res.status(400).send("Booking already cancelled");
            }

            const q2 = "UPDATE Bookings SET status = 'cancelled' WHERE booking_id = ? AND user_id = ?";

            connection.query(q2, [bid, uid], (err) => {
                connection.release();
                if (err) {
                    return res.status(500).send("Something went wrong");
                }
                return res.status(200).send("Your Booking cancelled successfully, Thanks for your patience");
            });
        });
    });
};

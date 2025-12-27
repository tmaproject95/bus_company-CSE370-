import pool from '../db.js'

export const seatinfo = (req, res) => {

    const { tid } = req.query;

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send("Something went wrong");
        } else {
            const q1 = "SELECT vehicle_id FROM Trips WHERE trip_id = ?";
            const q2 = "SELECT seat_id, seat_number, seat_type FROM Seats WHERE vehicle_id = ? ORDER BY seat_number ASC";

            connection.query(q1, [tid], (err, result) => {

                if (err) {
                    return res.status(500).send("Something went wrong");
                } else {
                    if (!result[0]) {
                        connection.release();
                        return res.status(404).send("Trip not found");
                    }

                    const vid = result[0].vehicle_id;
                    connection.query(q2, [vid], (err, results) => {
                        if (err) {
                            connection.release();
                            return res.status(500).send("Something went wrong");
                        } else {

                            const q3 = "SELECT seat_id FROM Bookings WHERE trip_id = ? AND status = 'confirmed'";
                            connection.query(q3, [tid], (err, resbook) => {
                                connection.release();
                                if (err) {
                                    return res.status(500).send("Something went wrong");
                                } else {
                                    const seatstatus = [];
                                    for (let i = 0; i < resbook.length; i++) {
                                        seatstatus.push(resbook[i].seat_id);
                                    }

                                    const sendingtouserSEATinfo = [];
                                    for (let i = 0; i < results.length; i++) {
                                        const seat = results[i];
                                        const isBooked = seatstatus.includes(seat.seat_id) ? 1 : 0;
                                        sendingtouserSEATinfo.push({
                                            seat_id: seat.seat_id,
                                            seat_number: seat.seat_number,
                                            seat_type: seat.seat_type,
                                            is_booked: isBooked
                                        });
                                    }

                                    return res.status(200).json(sendingtouserSEATinfo);
                                }
                            });

                        }
                    });
                }
            });
        }
    });
}

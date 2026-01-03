import pool from "../db.js";

/* FEATURE 8: LIVE BUS TRACKING */

export const updateLiveLocation = (req, res) => {
    const { trip_id, vehicle_id, latitude, longitude } = req.body;

    if (!trip_id || !vehicle_id || !latitude || !longitude) {
        return res.status(400).send("Missing location data");
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        /* teammate 3 code */
        const checkQ = `
            SELECT location_id
            FROM Live_Location
            WHERE trip_id = ?
        `;
        /* teammate 3 code */

        connection.query(checkQ, [trip_id], (err, result) => {
            if (err) {
                connection.release();
                return res.status(500).send("Location update failed");
            }

            /* teammate 3 code */
            if (result.length > 0) {
                const updateQ = `
                    UPDATE Live_Location
                    SET latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE trip_id = ?
                `;
                connection.query(updateQ, [latitude, longitude, trip_id], (err) => {
                    connection.release();
                    if (err) return res.status(500).send("Location update failed");
                    res.status(200).send("Location updated");
                });
            } else {
                const insertQ = `
                    INSERT INTO Live_Location (trip_id, vehicle_id, latitude, longitude)
                    VALUES (?, ?, ?, ?)
                `;
                connection.query(insertQ, [trip_id, vehicle_id, latitude, longitude], (err) => {
                    connection.release();
                    if (err) return res.status(500).send("Location update failed");
                    res.status(200).send("Location updated");
                });
            }
            /* teammate 3 code */
        });
    });
};

export const getLiveLocation = (req, res) => {
    const { trip_id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
            SELECT latitude, longitude, updated_at
            FROM Live_Location
            WHERE trip_id = ?
            ORDER BY updated_at DESC
            LIMIT 1
        `;

        connection.query(q, [trip_id], (err, result) => {
            connection.release();
            if (err) return res.status(500).send("Failed to fetch location");
            if (result.length === 0) return res.status(404).send("No location found");
            res.status(200).json(result[0]);
        });
    });
};

/* FEATURE 9: NOTIFICATIONS (UNCHANGED) */

export const getUserNotifications = (req, res) => {
    const { user_id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
            SELECT notification_id, message, type, is_read, created_at
            FROM Notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        connection.query(q, [user_id], (err, result) => {
            connection.release();
            if (err) return res.status(500).send("Failed to fetch notifications");
            res.status(200).json(result);
        });
    });
};

export const markNotificationRead = (req, res) => {
    const { notification_id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).send("DB error");

        const q = `
            UPDATE Notifications
            SET is_read = 1
            WHERE notification_id = ?
        `;

        connection.query(q, [notification_id], (err) => {
            connection.release();
            if (err) return res.status(500).send("Failed to update notification");
            res.status(200).send("Notification marked as read");
        });
    });
};

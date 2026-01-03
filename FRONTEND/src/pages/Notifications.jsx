import { useEffect, useState } from "react";
import axios from "../api/axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        axios.get(`/system/notifications/${userId}`)
            .then(res => setNotifications(res.data))
            .catch(() => {});
    }, [userId]);

    const markRead = (id) => {
        axios.put(`/system/notifications/read/${id}`)
            .then(() => {
                setNotifications(prev =>
                    prev.map(n =>
                        n.notification_id === id ? { ...n, is_read: 1 } : n
                    )
                );
            });
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>Notifications</h2>

            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map(n => (
                <div
                    key={n.notification_id}
                    style={{
                        background: n.is_read ? "#b2bec3" : "#f9ca24",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "6px"
                    }}
                >
                    <p>{n.message}</p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                    {!n.is_read && (
                        <button onClick={() => markRead(n.notification_id)}>
                            Mark as read
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Notifications;

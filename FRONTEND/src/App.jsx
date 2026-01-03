import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BusSearch from './pages/BusSearch';
import Trips from './pages/Trips';
import Seats from './pages/Seats';
import InitBooking from './pages/initbooking';
import Admin from './pages/Admin';
import Notifications from "./pages/Notifications";
import LiveLocation from "./pages/LiveLocation";
import { FiBell } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "./api/axios";

import './App.css';

function TopBar() {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;


        axios.get(`/system/notifications/${userId}`)
            .then(res => {
                const unread = res.data.filter(n => n.is_read === 0).length;
                setUnreadCount(unread);
            })
            .catch(err => console.error(err));
    }, [userId]);

    return (
        <div
            style={{
                position: "fixed",
                top: "10px",
                right: "20px",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}
        >

            <button
                onClick={() => navigate("/notifications")}
                style={{
                    position: "relative",
                    fontSize: "24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff"
                }}
            >
                <FiBell />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px 6px",
                            fontSize: "12px",
                            fontWeight: "bold"
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

        </div>
    );
}



function App() {
    return (
        <Router>
            <TopBar />

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<BusSearch />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/seats" element={<Seats />} />
                    <Route path="/initbookings" element={<InitBooking />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* teammate 3 feature */}
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/live-location" element={<LiveLocation />} />
                </Routes>
            </div>

            <footer className="footer-bar">
                <div className="ticker-wrap">
                    <div className="ticker-move">
                        <div className="ticker-item">
                            ✨ HORIZON TRAVELS at your service. Login to explore our premium routes. ✨
                        </div>
                    </div>
                </div>
            </footer>
        </Router>
    );
}

export default App;
export { TopBar };

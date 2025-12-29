import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BusSearch from './pages/BusSearch';
import Trips from './pages/Trips';
import Seats from './pages/Seats';



import './App.css';

function App() {
    return (
        <Router>
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<BusSearch />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/seats" element={<Seats />} />



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

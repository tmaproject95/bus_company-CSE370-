import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/register', formData);
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data || "Registration Failed");
        }
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setRel({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
    };

    const handleMouseUp = () => setDragging(false);

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPos({
            x: e.clientX - rel.x,
            y: e.clientY - rel.y
        });
    };

    return (
        <>
            <header className="page-header">
                Horizon Transport Services Limited
            </header>
            <div
                className="auth-container"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ left: pos.x, top: pos.y, position: 'absolute', cursor: 'grab' }}
            >
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">REGISTER</button>
                </form>
                <Link to="/login">Already have an account? Login</Link>
            </div>
            <div className="news-bar">
                <div className="news-text">
                    HORIZON TRAVELS at your service. At first, you need to register an account to access all the services
                </div>
            </div>
        </>
    );
};

export default Register;

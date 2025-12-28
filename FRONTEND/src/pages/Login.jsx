import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({ em: '', pa: '' });
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
            const response = await axios.post('/user/login', formData);
            alert("Login Successful!");
            console.log(response.data);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert(err.response?.data || "Login Failed");
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
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="em"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="pa"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">LOGIN</button>
                </form>
                <Link to="/register">Don't have an account? Register</Link>
            </div>
            <div className="news-bar">
                <div className="news-text">
                    HORIZON TRAVELS at your service. At first, you need to register an account to access all the services
                </div>
            </div>
        </>
    );
};

export default Login;

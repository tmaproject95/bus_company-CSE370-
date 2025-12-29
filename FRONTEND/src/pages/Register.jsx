import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nm: '',
        ema: '',
        phn: '',
        pass: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/register', formData);
            alert("Registration Successful");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data || "Registration Failed");
        }
    };

    return (
        <>
            <header className="page-header">
                Horizon Transport Services Limited
            </header>

            <div className="auth-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nm" placeholder="Full Name" onChange={handleChange} required />
                    <input type="email" name="ema" placeholder="Email Address" onChange={handleChange} required />
                    <input type="text" name="phn" placeholder="Phone Number" onChange={handleChange} required />
                    <input type="password" name="pass" placeholder="Password" onChange={handleChange} required />
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

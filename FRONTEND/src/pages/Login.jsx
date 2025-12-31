import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
    const [formData, setFormData] = useState({
        em: "",
        pa: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/user/login", formData);

            if (res.data === "Login Successful" || res.data.message === "Login Successful") {
                alert("Login Successful");

                if (res.data.user_id) {
                    localStorage.setItem("userId", res.data.user_id);
                } else {
                    console.warn("Backend did not return user_id. Booking might fail.");
                }

                navigate("/search");
            } else {
                alert(res.data);
            }
        } catch (err) {
            alert(err.response?.data || "Invalid credentials");
        }
    };

    return (
        <>
            <header className="page-header">
                Horizon Transport Services Limited
            </header>

            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="em" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="pa" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">LOGIN</button>
                </form>
                <Link to="/register">Create an account</Link>
            </div>

            <div className="news-bar">
                <div className="news-text">
                    ✨ HORIZON TRAVELS at your service. Login to explore our premium routes. ✨
                </div>
            </div>
        </>
    );
};

export default Login;